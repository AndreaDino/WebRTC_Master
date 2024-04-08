const socket = io();

//-------------[CANVAS]-------------//
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

//Game field
const gameField = {
  x: 0,
  y: 0,
  width: 1280,
  height: 720,
  lineWidth: 5,
  color: 'white',
};

const devicePixelRation = window.devicePixelRatio || 1;
canvas.width = 1280 * devicePixelRation;
canvas.height = 720 * devicePixelRation;
c.scale(devicePixelRation, devicePixelRation);

//-------------[VARIABLES]-------------//
const frontendPlayers = {};
const frontendWalls = {};
const SPEED = 10; //the SPEED parameter is used only to animate the predicted movement of the player on the client
const playerInputs = [];
let sequenceNumber = 0;

//-------------[UPDATE PLAYERS]-------------//
socket.on('updatePlayers', ({ backendPlayers, backendWalls }) => {
  for (const id in backendPlayers) {
    const backendPlayer = backendPlayers[id];

    //Create player's wall list
    if (!frontendWalls[id]) {
      frontendWalls[id] = [];
    }

    if (!frontendPlayers[id]) {
      //Player doesn't exist -> Create new player
      frontendPlayers[id] = new Player({
        x: backendPlayer.x,
        y: backendPlayer.y,
        radius: 10,
        color: backendPlayer.color,
        index: 0,
        score: backendPlayer.score,
        username: backendPlayer.username,
      });

      //Create leaderboard players
      document.querySelector(
        '#playerLabels'
      ).innerHTML += `<div data-id="${id}" data-score="${frontendPlayers[id].score}">${frontendPlayers[id].username}: ${frontendPlayers[id].score} </div>`;
    } else {
      //Existing player
      if (id === socket.id) {
        //update connected player position
        frontendPlayers[id].x = backendPlayer.x;
        frontendPlayers[id].y = backendPlayer.y;
        frontendPlayers[id].score = backendPlayer.score;

        //update walls
        for (const index in backendWalls[id]) {
          frontendWalls[id][index] = new Wall({
            x: backendWalls[id][index].x,
            y: backendWalls[id][index].y,
            color: backendWalls[id][index].color,
            h: backendWalls[id][index].h,
            w: backendWalls[id][index].w,
          });
        }

        //player prediction and server reconciliation
        const lastBackendInputIndex = playerInputs.findIndex((input) => {
          return backendPlayer.sequenceNumber === input.sequenceNumber;
        });
        if (lastBackendInputIndex > -1)
          playerInputs.splice(0, lastBackendInputIndex + 1);

        playerInputs.forEach((input) => {
          //player prediction
          frontendPlayers[id].x += input.dx;
          frontendPlayers[id].y += input.dy;

          //wall prediction
          if (frontendPlayers[id].index === 100)
            frontendPlayers[socket.id].index = 0;
          frontendWalls[id][frontendPlayers[id].index] = new Wall({
            x: frontendPlayers[id].x,
            y: frontendPlayers[id].y,
            color: frontendPlayers[id].color,
            h: 10,
            w: 10,
          });
          frontendPlayers[id].index++;
        });
      } else {
        //update other players
        frontendPlayers[id].x = backendPlayer.x;
        frontendPlayers[id].y = backendPlayer.y;
        frontendPlayers[id].score = backendPlayer.score;

        //update other walls
        for (const index in backendWalls[id]) {
          frontendWalls[id][index] = new Wall({
            x: backendWalls[id][index].x,
            y: backendWalls[id][index].y,
            color: backendWalls[id][index].color,
            h: backendWalls[id][index].h,
            w: backendWalls[id][index].w,
          });
        }
      }
      //Update leaderboard
      document.querySelector(
        `div[data-id="${id}"]`
      ).innerHTML = `${frontendPlayers[id].username}: ${frontendPlayers[id].score}`;
      document
        .querySelector(`div[data-id="${id}"]`)
        .setAttribute('data-score', frontendPlayers[id].score);
      sortLeaderboard();
    }
  }

  //-------------[DELETE PLAYERS]-------------//
  for (const id in frontendPlayers) {
    if (!backendPlayers[id]) {
      //delete from leaderboard and display start game
      const divToDelete = document.querySelector(`div[data-id="${id}"]`);
      divToDelete.parentNode.removeChild(divToDelete);
      if (id === socket.id) {
        document.querySelector('#usernameForm').style.display = 'block';
      }
      delete frontendPlayers[id];
      delete frontendWalls[id];

      //sound when destroyed
      if (id === socket.id) {
        var audio = new Audio('/audio/destroyed.wav');
        audio.volume = 0.4;
        audio.play();
      }
    }
  }
});

//-------------[ANIMATION]-------------//
let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = 'rgba(0, 0, 0, 0.1)';
  c.fillRect(gameField.x, gameField.y, gameField.width, gameField.height);

  //draw walls
  for (const id in frontendWalls) {
    for (const index in frontendWalls[id]) {
      const wall = frontendWalls[id][index];
      wall.draw();
    }
  }

  //draw players
  for (const id in frontendPlayers) {
    const player = frontendPlayers[id];
    player.draw();
  }

  //draw game field
  c.strokeStyle = gameField.color;
  c.lineWidth = gameField.lineWidth;
  c.strokeRect(gameField.x, gameField.y, gameField.width, gameField.height);
}
animate();

//-------------[PLAYER INPUT]-------------//
const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

window.addEventListener('keydown', (event) => {
  if (!frontendPlayers[socket.id]) return;
  switch (event.code) {
    case 'KeyW':
      keys.w.pressed = true;
      break;
    case 'KeyA':
      keys.a.pressed = true;
      break;
    case 'KeyS':
      keys.s.pressed = true;
      break;
    case 'KeyD':
      keys.d.pressed = true;
      break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyW':
      keys.w.pressed = false;
      break;
    case 'KeyA':
      keys.a.pressed = false;
      break;
    case 'KeyS':
      keys.s.pressed = false;
      break;
    case 'KeyD':
      keys.d.pressed = false;
      break;
  }
});

//input sampling (15ms), each input is given a sequence number, the event is emitted to the server and pushed to the prediction input list
setInterval(() => {
  if (!frontendPlayers[socket.id]) return;
  if (keys.w.pressed) {
    sequenceNumber++;
    playerInputs.push({ sequenceNumber, dx: 0, dy: -SPEED });
    frontendPlayers[socket.id].y -= SPEED;
    socket.emit('keydown', { keycode: 'KeyW', sequenceNumber });
  }
  if (keys.a.pressed) {
    sequenceNumber++;
    playerInputs.push({ sequenceNumber, dx: -SPEED, dy: 0 });
    frontendPlayers[socket.id].x -= SPEED;
    socket.emit('keydown', { keycode: 'KeyA', sequenceNumber });
  }
  if (keys.s.pressed) {
    sequenceNumber++;
    playerInputs.push({ sequenceNumber, dx: 0, dy: +SPEED });
    frontendPlayers[socket.id].y += SPEED;
    socket.emit('keydown', { keycode: 'KeyS', sequenceNumber });
  }
  if (keys.d.pressed) {
    sequenceNumber++;
    playerInputs.push({ sequenceNumber, dx: +SPEED, dy: 0 });
    frontendPlayers[socket.id].x += SPEED;
    socket.emit('keydown', { keycode: 'KeyD', sequenceNumber });
  }
}, 15);

//---------[INIT GAME]---------//
document.querySelector('#usernameForm').addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#usernameForm').style.display = 'none';
  let username = document.querySelector('#usernameId').value;
  socket.emit('initGame', username);
});

//---------[FUNCTIONS]---------//
function sortLeaderboard() {
  const parentDiv = document.querySelector('#playerLabels');
  const childDiv = Array.from(parentDiv.querySelectorAll('div'));
  childDiv.sort((a, b) => {
    const scoreA = Number(a.getAttribute('data-score'));
    const scoreB = Number(b.getAttribute('data-score'));
    return scoreB - scoreA;
  });
  childDiv.forEach((div) => {
    parentDiv.removeChild(div);
  });
  childDiv.forEach((div) => {
    parentDiv.appendChild(div);
  });
}
