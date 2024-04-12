//---------[IMPORT]---------
import geckos, { iceServers } from '@geckos.io/server';
import http from 'http';
import express from 'express';

//---------[SETUP GECKOS IO]---------
const app = express();
const server = http.createServer(app);
const io = geckos({ iceServers: iceServers });
const port = 9208;

app.use('/', express.static('public'));

io.addServer(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//---------[VARIABLES]---------
const backendWalls = {};
const backendPlayers = {};
const WALL_MAX = 100;
const SPEED = 10;
const CANVAS_HEIGHT = 720;
const CANVAS_WIDTH = 1280;

//---------[CONNECTION]---------
io.onConnection((socket) => {
  io.emit(
    'updatePlayers',
    { backendPlayers, backendWalls },
    {
      reliable: true,
      interval: 20,
      runs: 5,
    }
  );

  //---------[DISCONNECTION]---------
  socket.onDisconnect((reason) => {
    console.log(reason);
    delete backendPlayers[socket.id];
    delete backendWalls[socket.id];
    io.emit(
      'updatePlayers',
      { backendPlayers, backendWalls },
      {
        reliable: true,
        interval: 20,
        runs: 5,
      }
    );
  });

  //---------[UPDATE POSITION]---------
  socket.on('keydown', ({ keycode, sequenceNumber }) => {
    if (!backendPlayers[socket.id]) return -1;
    backendPlayers[socket.id].sequenceNumber = sequenceNumber;

    //Update player position
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

    //Update walls positions
    if (backendPlayers[socket.id].index === WALL_MAX)
      backendPlayers[socket.id].index = 0;

    backendWalls[socket.id][backendPlayers[socket.id].index] = {
      x: backendPlayers[socket.id].x,
      y: backendPlayers[socket.id].y,
      color: backendPlayers[socket.id].color,
      h: 10,
      w: 10,
    };
    backendPlayers[socket.id].index++;
  });

  //---------[INIT GAME (user press start button)]---------
  socket.on('initGame', (username) => {
    //Sanitation of user input
    let sanitize = username.replace(/[^a-zA-Z0-9 ]/g, '');
    sanitize = sanitize.slice(0, 15);

    //Create backend player
    backendPlayers[socket.id] = {
      x: 1024 * Math.random(),
      y: 576 * Math.random(),
      radius: 10,
      color: 360 * Math.random(),
      sequenceNumber: 0,
      index: 0,
      score: 0,
      username: sanitize,
    };

    //Create player wall list
    backendWalls[socket.id] = [];
  });
});

//---------[UPDATE BY INTERVAL]---------
setInterval(() => {
  io.emit(
    'updatePlayers',
    { backendPlayers, backendWalls },
    {
      reliable: true,
      interval: 20,
      runs: 5,
    }
  );

  //---------[CHECK COLLISIONS]---------
  for (const id in backendPlayers) {
    const player = backendPlayers[id];

    //Check colliding game field bounds
    if (GameFieldColliding(player, CANVAS_HEIGHT, CANVAS_WIDTH)) {
      delete backendPlayers[id];
      delete backendWalls[id];
      continue;
    }

    //Check colliding other player's wall
    for (const playerWall in backendWalls) {
      if (playerWall === id) continue;
      for (const index in backendWalls[playerWall]) {
        if (RectCircleColliding(player, backendWalls[playerWall][index])) {
          delete backendPlayers[id];
          delete backendWalls[id];
          backendPlayers[playerWall].score++;
          break;
        }
      }
    }
  }
}, 15);

server.listen(port, () => {
  console.log(`listening on http://localhost:${port}/`);
});

//---------[FUNCTIONS]---------
//Check if the rectangle and circle are colliding
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

//Check if the circle is colliding with border
function GameFieldColliding(element, max_border_y, max_border_x) {
  if (
    element.x <= 0 ||
    element.y <= 0 ||
    element.x >= max_border_x ||
    element.y >= max_border_y
  ) {
    return true;
  } else {
    return false;
  }
}
