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
app.use(express.static(path.join('../client/public')));

const port = process.env.PORT || 1337;

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});

const connected = [];

io.on("connection", (socket) => {
  console.log("new client connected");
  socket.on("join game", ({room, teamName}) => {
    connected.push({room, activeSessions: [teamName]})
    console.log(connected)
  })
});
