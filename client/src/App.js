import "./App.css";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import Playground from "./components/Playground";
import { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import immer from "immer";

function App() {
  const [connected, setConnected] = useState(false);
  const [round, setRound] = useState(1);
  const [roomNumber, setRoomNumber] = useState("");
  const [teamName, setTeamName] = useState("");
  const socketRef = useRef();

  const connect = (e, roomNumber, teamName) => {
    e.preventDefault();
    setConnected(true);
    socketRef.current = io("/", {transports: ['polling']});
    socketRef.current.emit("join game", {
      roomNumber: parseInt(roomNumber),
      teamName: teamName,
    });
   
  };

  const changeRoomNumber = (e) => {
    setRoomNumber(e.target.value);
  };

  const changeTeamName = (e) => {
    setTeamName(e.target.value);
  };

  let body;
  if (connected) {
    body = <Playground round={round} />;
  } else {
    body = (
      <LandingPage
        connect={connect}
        roomNumber={roomNumber}
        teamName={teamName}
        onChangeRoomNumber={changeRoomNumber}
        onChangeTeamName={changeTeamName}
      />
    );
  }

  return (
    <div className="App">
      <Header />
      {body}
    </div>
  );
}

export default App;
