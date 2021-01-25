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

io.on("connection", socket => {
  console.log("new client connected");
  socket.on("join game", ({ roomNumber, teamName, isFacilitator }) => {
    let currentSessionData = connected.filter(element => element.roomNumber === roomNumber)[0];
    if (currentSessionData) {
      if (currentSessionData.activeSessions.length > 3) {
        socket.emit("connection error", `room ${roomNumber} full`);
        return;
      }
      if (currentSessionData.activeSessions.find(element => element.teamName === teamName)) {
        socket.emit("connection error", `The name ${teamName} is taken`);
        return;
      }
      if (isFacilitator === true && currentSessionData.activeSessions.find(element => element.isFacilitator === isFacilitator)) {
        socket.emit("connection error", `There is already a facilitator in this room.`);
        return;
      }
      if (
        currentSessionData.activeSessions.length > 2 &&
        isFacilitator === false &&
        !currentSessionData.activeSessions.find(element => element.isFacilitator === true)
      ) {
        socket.emit(
          "connection error",
          `There are already 3 players in this room but no facilitator. Please tick the box above to join as facilitator.`
        );
        return;
      }
    }
    socket.join(roomNumber, teamName);
    let index = connected.indexOf(currentSessionData);
    if (currentSessionData) {
      currentSessionData.activeSessions.push({ teamName, isFacilitator });
      connected.splice(index, 1, currentSessionData);
    } else {
      connected.push({
        roomNumber,
        activeSessions: [{ teamName, isFacilitator }],
      });
    }
    currentSessionData && currentSessionData.activeSessions.length > 3
      ? io.to(roomNumber).emit("can start game")
      : io.to(roomNumber).emit("cannot start game");
    io.to(roomNumber).emit(
      "joined teams in current room",
      connected.filter(element => element.roomNumber === roomNumber)
    );
  });

  socket.on("start game", ({ round, roomNumber, teamName, choice, score }) => {
    let currentGame = gameRoomTracker.filter(element => {
      return (element.roomNumber = roomNumber);
    })[0];
    let index = gameRoomTracker.indexOf(currentGame);
    if (currentGame) {
      if (currentGame.rounds[round - 1] && currentGame.rounds[round - 1].choices.length < 3) {
        currentGame.rounds[round - 1].choices.push({ teamName, choice, score });
        gameRoomTracker.splice(index, 1, currentGame);
      } else if (!currentGame.rounds[round - 1]) {
        currentGame.rounds.push({
          round,
          choices: [{ teamName, choice, score }],
        });
      }
    } else {
      gameRoomTracker.push({
        rounds: [
          {
            round,
            choices: [{ teamName, choice, score }],
          },
        ],
        roomNumber: roomNumber,
      });
    }
    if (currentGame && currentGame.rounds[round - 1].choices.length > 2) {
      currentGame.rounds[round - 1].choices = calculateCurrentRoundScore(currentGame.rounds[round - 1].choices);
      io.to(roomNumber).emit("finish round", currentGame);
    } else {
      io.to(roomNumber).emit("started game", currentGame);
    }
    if (round > 9) {
      io.to(roomNumber).emit("finish game", "game over");
    }
  });
});

const calculateCurrentRoundScore = choices => {
  let redChoices = choices.filter(choice => choice.choice === "red");
  let greenChoices = choices.filter(choice => choice.choice === "green");

  switch (true) {
    case redChoices.length === 3 && greenChoices.length === 0:
      redChoices.forEach(element => {
        element.score = -1;
      });
      break;
    case redChoices.length === 2 && greenChoices.length === 1:
      redChoices.forEach(element => {
        element.score = 2;
      });
      greenChoices[0].score = -3;
      break;
    case redChoices.length === 1 && greenChoices.length === 2:
      greenChoices.forEach(element => {
        element.score = -2;
      });
      redChoices[0].score = 3;
      break;
    case redChoices.length === 0 && greenChoices.length === 3:
      greenChoices.forEach(element => {
        element.score = 1;
      });
      break;
  }

  return redChoices.concat(greenChoices);
};
