const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join("../client/public")));

const port = process.env.PORT || 1337;

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});

const connected = [];
const gameRoomTracker = [];

io.on("connection", (socket) => {
  console.log("new client connected");
  socket.on("join game", ({ roomNumber, teamName }) => {
    socket.join(roomNumber, teamName);
    let currentSessionData = connected.filter(
      (element) => element.roomNumber === roomNumber
    )[0];
    let index = connected.indexOf(currentSessionData);
    if (currentSessionData) {
      if (currentSessionData.activeSessions.length > 3) {
        socket.emit("room is full", `room ${roomNumber} full`);
        return;
      }
      currentSessionData.activeSessions.push(teamName);
      connected.splice(index, 1, currentSessionData);
    } else {
      connected.push({ roomNumber, activeSessions: [teamName] });
    }
    if (currentSessionData && currentSessionData.activeSessions.length > 3) {
      io.to(roomNumber).emit("can start game");
    }
    io.to(roomNumber).emit(
      "joined teams in current room",
      connected.filter((element) => element.roomNumber === roomNumber)
    );
  });

  socket.on("start game", ({ round, roomNumber, teamName, choice }) => {
    let currentGame = gameRoomTracker.filter((element) => {
      return (element.roomNumber = roomNumber);
    })[0];
    let index = gameRoomTracker.indexOf(currentGame);
    if (currentGame) {
      if (currentGame.rounds[round - 1] && currentGame.rounds[round - 1].choices.length < 3) {
        currentGame.rounds[round - 1].choices.push({ teamName, choice });
        gameRoomTracker.splice(index, 1, currentGame);
      }
      else if(!currentGame.rounds[round - 1]) {
          currentGame.rounds.push( {
            round,
            choices: [{ teamName, choice }],
          })
      }
    } else {
      gameRoomTracker.push({
        rounds: [
          {
            round,
            choices: [{ teamName, choice }],
          },
        ],
        roomNumber: roomNumber,
      });
    }
    currentGame && currentGame.rounds[round - 1].choices.length > 2
      ? io.to(roomNumber).emit("finish round", gameRoomTracker)
      : io.to(roomNumber).emit("started game", gameRoomTracker);
  });
});
