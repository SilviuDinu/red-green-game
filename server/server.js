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
app.use(express.static(path.join("../client/build")));

const port = process.env.PORT || 1337;

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});

const connected = [];
const gameRoomTracker = [];

io.on("connection", socket => {
  console.log("new client connected");
  socket.on("join_game", async ({ roomNumber, teamName, isFacilitator, rejoin }) => {
    let currentSessionData = connected.find(element => element.roomNumber === roomNumber);
    let game = gameRoomTracker.find(elem => elem.roomNumber === roomNumber);
    if (currentSessionData) {
      if (
        currentSessionData.activeSessions.length > 3 ||
        (game &&
          game.rounds &&
          game.rounds.length > 9 &&
          game.rounds[game.rounds.length - 1].choices.length > 2 &&
          currentSessionData.activeSessions.length > 0)
      ) {
        socket.emit("connection_error", `Room ${roomNumber} is full or cannot be joined yet. Please join a different room.`);
        return;
      }
      if (currentSessionData.activeSessions.find(element => element.teamName === teamName)) {
        socket.emit("connection_error", `The name ${teamName} is taken`);
        return;
      }
      if (isFacilitator === true && currentSessionData.activeSessions.find(element => element.isFacilitator === isFacilitator)) {
        socket.emit("connection_error", `There is already a facilitator in this room.`);
        return;
      }
      if (
        currentSessionData.activeSessions.length > 2 &&
        isFacilitator === false &&
        !currentSessionData.activeSessions.find(element => element.isFacilitator === true)
      ) {
        socket.emit(
          "connection_error",
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
        roomLocked: false,
      });
    }

    io.to(roomNumber).emit(
      "joined_teams_in_current_room",
      connected.filter(element => element.roomNumber === roomNumber)
    );
    currentSessionData && currentSessionData.activeSessions.length > 3
      ? !rejoin
        ? io.to(roomNumber).emit("can_start_game", null)
        : socket.emit(
            "can_start_game",
            gameRoomTracker.find(element => {
              return element.roomNumber === roomNumber;
            })
          )
      : io.to(roomNumber).emit("cannot_start_game");
  });

  socket.on("request_re_join", async ({ roomNumber, teamName, isFacilitator }) => {
    let currentStatus = connected.find(element => element.roomNumber === roomNumber);
    let game = gameRoomTracker.find(elem => elem.roomNumber === roomNumber);
    if (
      ((game && !(game.rounds.length > 9 && game.rounds[game.rounds.length - 1].choices.length > 2)) || !game) &&
      currentStatus &&
      currentStatus.activeSessions.find(elem => elem.teamName === teamName && elem.isFacilitator === isFacilitator)
    ) {
      let currentActiveSession = currentStatus.activeSessions.find(elem => elem.teamName === teamName && elem.isFacilitator === isFacilitator);
      let currIndex = currentStatus.activeSessions.indexOf(currentActiveSession);
      currentStatus.activeSessions.splice(currIndex, 1);
      socket.emit("can_re_join");
    } else {
      socket.emit("cannot_re_join", game && game.rounds && game.rounds.length > 9 && game.rounds[game.rounds.length - 1].choices.length > 2);
      if (game && game.rounds && !(game.rounds.length > 9 && game.rounds[game.rounds.length - 1].choices.length > 2)) {
        clearRoom(roomNumber, teamName, isFacilitator);
      }
    }
  });

  socket.on("room_clear", async ({ roomNumber, teamName, isFacilitator }) => {
    clearRoom(roomNumber, teamName, isFacilitator);
  });

  socket.on("start_game", async ({ round, roomNumber, teamName, choice, score }) => {
    // check if the room exists already
    let currentGame = await gameRoomTracker.find(element => {
      return element.roomNumber === roomNumber;
    });

    let index = gameRoomTracker.indexOf(currentGame);
    if (currentGame) {
      if (currentGame.rounds[round - 1] && currentGame.rounds[round - 1].choices.length < 3) {
        if (!currentGame.rounds[round - 1].choices.find(elem => elem.teamName === teamName)) {
          currentGame.rounds[round - 1].choices.push({ teamName, choice, score });
          gameRoomTracker.splice(index, 1, currentGame);
        }
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

    if (currentGame && currentGame.rounds[round - 1] && currentGame.rounds[round - 1].choices.length > 2) {
      currentGame.rounds[round - 1].choices = await calculateCurrentRoundScore(currentGame.rounds[round - 1].choices, round);
      gameRoomTracker.splice(index, 1, currentGame);
      io.to(roomNumber).emit("finish_round", currentGame);
    } else {
      io.to(roomNumber).emit(
        "started_game",
        gameRoomTracker.find(element => {
          return element.roomNumber === roomNumber;
        })
      );
    }
    if (round > 9 && currentGame.rounds[round - 1].choices.length > 2) {
      const endGame = {
        gameRoomTracker: currentGame,
        connected: connected.find(element => element.roomNumber === roomNumber),
      };
      io.to(roomNumber).emit("finish_game", endGame);
    }
  });
});

const clearRoom = async (roomNumber, teamName, isFacilitator) => {
  const sessionData = connected.find(element => element.roomNumber === roomNumber);
  if (sessionData && sessionData.activeSessions.find(elem => elem.teamName === teamName && elem.isFacilitator === isFacilitator)) {
    let sessionIndex = connected.indexOf(sessionData);
    sessionData.activeSessions.splice(
      sessionData.activeSessions.indexOf(sessionData.activeSessions.find(elem => elem.teamName === teamName && elem.isFacilitator === isFacilitator)),
      1
    );
    if (sessionData.activeSessions.length > 0) {
      connected.splice(sessionIndex, 1, sessionData);
    } else {
      connected.splice(sessionIndex, 1);
      gameRoomTracker.splice(gameRoomTracker.indexOf(gameRoomTracker.find(element => element.roomNumber === roomNumber)), 1);
    }
  }
};

const calculateCurrentRoundScore = async (choices, round) => {
  let redChoices = choices.filter(choice => choice.choice === "red");
  let greenChoices = choices.filter(choice => choice.choice === "green");

  // calculate score for each round based on user choices
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

  // double scores for 6th and 9th rounds
  if (round === 6 || round === 9) {
    redChoices.forEach(element => {
      element.score *= 2;
    });
    greenChoices.forEach(element => {
      element.score *= 2;
    });
  }

  return redChoices.concat(greenChoices);
};
