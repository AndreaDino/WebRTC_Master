import geckos from '@geckos.io/client';

const socket = geckos({ port: location.port });

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

//game field
const gameField = {
  x: 0,
  y: 0,
  width: 1280,
  height: 720,
  lineWidth: 5,
  color: 'white',
};

class Player {
  constructor({ x, y, radius, color, index, score, username }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.index = index;
    this.score = score;
    this.username = username;
  }

  draw() {
    let hsl = `hsl(${this.color} , 100%,50%)`;
    c.save();
    c.shadowColor = `hsl(${this.color} , 100%,30%)`;
    c.shadowBlur = 5;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = hsl;
    c.fill();
    c.restore();
  }
}
class Wall {
  constructor({ x, y, color, h, w }) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.h = h;
    this.w = w;
  }

  draw() {
    let hsl = `hsl(${this.color} , 100%,50%)`;
    c.save();
    c.shadowColor = `hsl(${this.color} , 100%,30%)`;
    c.shadowBlur = 5;
    c.beginPath();
    c.rect(this.x - 5, this.y - 5, this.h, this.w);
    c.fillStyle = hsl;
    c.fill();
    c.restore();
  }
}

const devicePixelRation = window.devicePixelRatio || 1;

canvas.width = 1280 * devicePixelRation;
canvas.height = 720 * devicePixelRation;

c.scale(devicePixelRation, devicePixelRation);

const x = canvas.width / 2;
const y = canvas.height / 2;

const frontendPlayers = {};
const frontendWalls = {};

socket.onConnect(function (error) {
  console.log("Hello everyone, I'm " + socket.id);

  socket.on('updateWalls', (backendWalls) => {
    for (const id in backendWalls) {
      for (const index in backendWalls[id]) {
        //console.log('WALL:');
        frontendWalls[id][index] = new Wall({
          x: backendWalls[id][index].x,
          y: backendWalls[id][index].y,
          color: backendWalls[id][index].color,
          h: backendWalls[id][index].h,
          w: backendWalls[id][index].w,
        });
      }
    }
  });

  socket.on('updatePlayers', (backendPlayers) => {
    console.log(performance.now());

    for (const id in backendPlayers) {
      const backendPlayer = backendPlayers[id];

      if (!frontendWalls[id]) {
        frontendWalls[id] = [];
      }

      if (!frontendPlayers[id]) {
        //create new player
        //frontendWalls[socket.id] = [];

        frontendPlayers[id] = new Player({
          x: backendPlayer.x,
          y: backendPlayer.y,
          radius: 10,
          color: backendPlayer.color,
          index: backendPlayer.index,
          score: backendPlayer.score,
          username: backendPlayer.username,
        });

        //create leaderboard players
        console.log(frontendPlayers[id].username);
        document.querySelector(
          '#playerLabels'
        ).innerHTML += `<div data-id="${id}" data-score="${frontendPlayers[id].score}">${frontendPlayers[id].username}: ${frontendPlayers[id].score} </div>`;
      } else {
        if (id === socket.id) {
          //update position
          frontendPlayers[id].x = backendPlayer.x;
          frontendPlayers[id].y = backendPlayer.y;
          frontendPlayers[id].score = backendPlayer.score;

          //update leaderboard
          document.querySelector(
            `div[data-id="${id}"]`
          ).innerHTML = `${frontendPlayers[id].username}: ${frontendPlayers[id].score}`;

          document
            .querySelector(`div[data-id="${id}"]`)
            .setAttribute('data-score', frontendPlayers[id].score);

          //sort leaderboard
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

          //server reconciliation
          const lastBackendInputIndex = playerInputs.findIndex((input) => {
            return backendPlayer.sequenceNumber === input.sequenceNumber;
          });
          if (lastBackendInputIndex > -1)
            playerInputs.splice(0, lastBackendInputIndex + 1);

          playerInputs.forEach((input) => {
            frontendPlayers[id].x += input.dx;
            frontendPlayers[id].y += input.dy;
          });
        } else {
          frontendPlayers[id].x = backendPlayer.x;
          frontendPlayers[id].y = backendPlayer.y;
          frontendPlayers[id].score = backendPlayer.score;

          //update leaderboard for other players
          document.querySelector(
            `div[data-id="${id}"]`
          ).innerHTML = `${frontendPlayers[id].username}: ${frontendPlayers[id].score}`;

          document
            .querySelector(`div[data-id="${id}"]`)
            .setAttribute('data-score', frontendPlayers[id].score);

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
      }
    }

    //delete
    for (const id in frontendPlayers) {
      if (!backendPlayers[id]) {
        //delete from leaderboard
        const divToDelete = document.querySelector(`div[data-id="${id}"]`);
        divToDelete.parentNode.removeChild(divToDelete);
        if (id === socket.id) {
          document.querySelector('#usernameForm').style.display = 'block';
        }
        //delete player
        delete frontendPlayers[id];
        delete frontendWalls[id];

        //music when destroyed
        if (id === socket.id) {
          console.log('audio');
          var audio = new Audio('/audio/destroyed.wav');
          audio.volume = 0.4;
          audio.play();
        }
      }
    }

    //console.log(frontendPlayers);
  });

  let animationId;

  function animate() {
    animationId = requestAnimationFrame(animate);
    c.fillStyle = 'rgba(0, 0, 0, 0.1)';
    c.fillRect(gameField.x, gameField.y, gameField.width, gameField.height);

    for (const id in frontendWalls) {
      for (const index in frontendWalls[id]) {
        const wall = frontendWalls[id][index];
        //console.log(wall);
        wall.draw();
      }
    }

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

  const SPEED = 10;
  const playerInputs = [];
  let sequenceNumber = 0;
  setInterval(() => {
    if (!frontendPlayers[socket.id]) return;
    if (keys.w.pressed) {
      sequenceNumber++;
      playerInputs.push({ sequenceNumber, dx: 0, dy: -SPEED });
      frontendPlayers[socket.id].y -= SPEED;
      socket.emit(
        'keydown',
        { keycode: 'KeyW', sequenceNumber },
        {
          reliable: true,
          interval: 20,
          runs: 5,
        }
      );
    }
    if (keys.a.pressed) {
      sequenceNumber++;
      playerInputs.push({ sequenceNumber, dx: -SPEED, dy: 0 });
      frontendPlayers[socket.id].x -= SPEED;
      socket.emit(
        'keydown',
        { keycode: 'KeyA', sequenceNumber },
        {
          reliable: true,
          interval: 20,
          runs: 5,
        }
      );
    }
    if (keys.s.pressed) {
      sequenceNumber++;
      playerInputs.push({ sequenceNumber, dx: 0, dy: +SPEED });
      frontendPlayers[socket.id].y += SPEED;
      socket.emit(
        'keydown',
        { keycode: 'KeyS', sequenceNumber },
        {
          reliable: true,
          interval: 20,
          runs: 5,
        }
      );
    }
    if (keys.d.pressed) {
      sequenceNumber++;
      playerInputs.push({ sequenceNumber, dx: +SPEED, dy: 0 });
      frontendPlayers[socket.id].x += SPEED;
      socket.emit(
        'keydown',
        { keycode: 'KeyD', sequenceNumber },
        {
          reliable: true,
          interval: 20,
          runs: 5,
        }
      );
    }
  }, 15);

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

  document
    .querySelector('#usernameForm')
    .addEventListener('submit', (event) => {
      event.preventDefault();
      document.querySelector('#usernameForm').style.display = 'none';
      console.log(document.querySelector('#usernameId').value);
      socket.emit('initGame', document.querySelector('#usernameId').value, {
        reliable: true,
        interval: 20,
        runs: 5,
      });
    });
});
