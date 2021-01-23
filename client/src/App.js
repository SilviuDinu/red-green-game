import "./App.css";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import RoomInfo from "./components/RoomInfo";
import Playground from "./components/Playground";
import { useState, useRef, useEffect } from "react";
import io from "socket.io-client";

function App() {
  const [connected, setConnected] = useState(false);
  const [connectedTeams, setConnectedTeams] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isRoomFull, setIsRoomFull] = useState(false);
  const [round, setRound] = useState(1);
  const [roundData, setRoundData] = useState([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [teamName, setTeamName] = useState("");
  const [showButtons, setShowButtons] = useState(true);
  const [showWaiting, setShowWaiting] = useState(true);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("/", { transports: ["polling"] });
    socketRef.current.on("finish round", (data) => {
      // let currentRoundData = [...roundData];
      // currentRoundData.push(data.rounds);
      setRoundData(roundData => roundData.concat(data.rounds));
      setPlayState();
      setRound(round => round+1);
    });
  }, []);

  const connect = (e, roomNumber, teamName, choice) => {
    e.preventDefault();
    socketRef.current.emit("join game", {
      roomNumber: parseInt(roomNumber),
      teamName: teamName,
    });
    socketRef.current.on("joined teams in current room", (data) => {
      setConnectedTeams(data[0].activeSessions);
    });
    socketRef.current.on("room is full", (data) => {
      alert(data);
    });
    socketRef.current.on("can start game", () => {
      setPlayState();
      setGameStarted(true);
    });
    socketRef.current.on("cannot start game", () => {
      setWaitingState();
    });

    setConnected(true);
  };

  const changeRoomNumber = (e) => {
    setRoomNumber(e.target.value);
  };

  const changeTeamName = (e) => {
    setTeamName(e.target.value);
  };

  const play = (round, roomNumber, teamName, choice) => {
    setWaitingState();
    socketRef.current.emit("start game", {
      round: round,
      roomNumber: parseInt(roomNumber),
      teamName: teamName,
      choice: choice,
    });
    socketRef.current.on("started game", (roundData) => {
      console.log(roundData);
    });
  };

  const setWaitingState = () => {
    setShowButtons(false);
    setShowWaiting(true);
  };

  const setPlayState = () => {
    setShowWaiting(false);
    setShowButtons(true);
  };

  let body;
  if (connected) {
    body = (
      <>
        <RoomInfo connectedTeams={connectedTeams} roomNumber={roomNumber} />
        <Playground
          round={round}
          gameStarted={gameStarted}
          play={play}
          roomNumber={roomNumber}
          roundData={roundData}
          connectedTeams={connectedTeams}
          teamName={teamName}
          showButtons={showButtons}
          showWaiting={showWaiting}
          setWaitingState={setWaitingState}
          setPlayState={setPlayState}
        />
      </>
    );
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
