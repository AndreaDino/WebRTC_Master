import geckos from '@geckos.io/server';
import http from 'http';
import express from 'express';

const port = 9208;
const app = express();
const server = http.createServer(app);
const io = geckos();

app.use('/', express.static('public'));

io.addServer(server);

const backendWalls = {};
const backendPlayers = {};
const SPEED = 10;

io.onConnection((socket) => {
  console.log('a user connected:' + socket.id);

  io.emit('updatePlayers', backendPlayers, {
    reliable: true,
    interval: 20,
    runs: 5,
  });
  io.emit('updateWalls', backendWalls, {
    reliable: true,
    interval: 20,
    runs: 5,
  });
  //console.log(backendPlayers);

  socket.onDisconnect((reason) => {
    console.log(reason);
    delete backendPlayers[socket.id];
    delete backendWalls[socket.id];
    io.emit('updatePlayers', backendPlayers, {
      reliable: true,
      interval: 20,
      runs: 5,
    });
    io.emit('updateWalls', backendWalls, {
      reliable: true,
      interval: 20,
      runs: 5,
    });
  });

  //update objects  position
  socket.on('keydown', ({ keycode, sequenceNumber }) => {
    if (!backendPlayers[socket.id]) return -1;
    //console.log(keycode);
    backendPlayers[socket.id].sequenceNumber = sequenceNumber;

    //update player position
    switch (keycode) {
      case 'KeyW':
        backendPlayers[socket.id].y -= SPEED;

        break;
      case 'KeyA':
        backendPlayers[socket.id].x -= SPEED;
        break;
      case 'KeyS':
        backendPlayers[socket.id].y += SPEED;
        break;
      case 'KeyD':
        backendPlayers[socket.id].x += SPEED;
        break;
    }

    //update walls positions

    if (backendPlayers[socket.id].index === 50)
      backendPlayers[socket.id].index = 0;

    let newWall = {
      x: backendPlayers[socket.id].x,
      y: backendPlayers[socket.id].y,
      color: backendPlayers[socket.id].color,
      h: 10,
      w: 10,
    };

    backendWalls[socket.id][backendPlayers[socket.id].index] = newWall;
    backendPlayers[socket.id].index++;
  });

  //listen to GameInit
  socket.on('initGame', (username) => {
    //create backend player
    console.log('game init:');

    backendPlayers[socket.id] = {
      x: 1024 * Math.random(),
      y: 576 * Math.random(),
      radius: 10,
      color: 360 * Math.random(),
      sequenceNumber: 0,
      index: 0,
      score: 0,
      username: username,
    };
    //create player wall list
    backendWalls[socket.id] = [];

    console.log('username:');
    console.log(username);
  });
});

// return true if the rectangle and circle are colliding
function RectCircleColliding(circle, rect) {
  var distX = Math.abs(circle.x - rect.x - rect.w / 2);
  var distY = Math.abs(circle.y - rect.y - rect.h / 2);

  if (distX > rect.w / 2 + circle.radius) {
    return false;
  }
  if (distY > rect.h / 2 + circle.radius) {
    return false;
  }

  if (distX <= rect.w / 2) {
    return true;
  }
  if (distY <= rect.h / 2) {
    return true;
  }

  var dx = distX - rect.w / 2;
  var dy = distY - rect.h / 2;

  return dx * dx + dy * dy <= circle.radius * circle.radius;
}

//update interval
setInterval(() => {
  io.emit('updatePlayers', backendPlayers, {
    reliable: true,
    interval: 20,
    runs: 5,
  });
  //console.log('backendWalls: ');
  //console.log(backendWalls);
  io.emit('updateWalls', backendWalls, {
    reliable: true,
    interval: 150,
    runs: 5,
  });

  //update collisions

  for (const id in backendPlayers) {
    const player = backendPlayers[id];

    //check bounds
    if (player.x <= 0 || player.y <= 0 || player.x >= 1280 || player.y >= 720) {
      console.log('out of bounds');
      delete backendPlayers[id];
      delete backendWalls[id];
      continue;
    }

    for (const playerWall in backendWalls) {
      if (playerWall === id) continue;
      for (const index in backendWalls[playerWall]) {
        // const DISTANCE = Math.hypot(
        //   player.x - backendWalls[playerWall][index].x,
        //   player.y - backendWalls[playerWall][index].y
        // );
        if (RectCircleColliding(player, backendWalls[playerWall][index])) {
          console.log('COLLISION DETECTED');
          console.log('playerID:' + id + 'wallID: ' + playerWall);

          delete backendPlayers[id];
          delete backendWalls[id];
          backendPlayers[playerWall].score++;

          console.log(
            'playerID:' +
              playerWall +
              'score: ' +
              backendPlayers[playerWall].score
          );
          break;
        }
      }
    }
  }
}, 15);

server.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}/`);
});
