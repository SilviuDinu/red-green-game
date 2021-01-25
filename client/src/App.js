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
  const [anyConnectionError, setAnyConnectionError] = useState(false);
  const [round, setRound] = useState(1);
  const [roundData, setRoundData] = useState([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [teamName, setTeamName] = useState("");
  const [showButtons, setShowButtons] = useState(true);
  const [showWaiting, setShowWaiting] = useState(true);
  const [isFacilitator, setIsFacilitator] = useState(false);
  const [message, setMessage] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("/", { transports: ["polling"] });
    }
    socketRef.current.on("finish round", (data) => {
      setRoundData(data.rounds);
      setPlayState();
      setRound((round) => round + 1);
    });
  }, []);

  const handleCheck = () => {
    setIsFacilitator(!isFacilitator);
  };

  const connect = (e, roomNumber, teamName, facilitator) => {
    e.preventDefault();
    socketRef.current.emit("join game", {
      roomNumber: parseInt(roomNumber),
      teamName: teamName,
      isFacilitator: facilitator,
    });
    socketRef.current.on("connection error", (error) => {
      setAnyConnectionError(true);
      setMessage(error);
    });
    socketRef.current.on("joined teams in current room", (data) => {
      setConnectedTeams(data[0].activeSessions);
      setAnyConnectionError(false);
      setConnected(true);
    });
    socketRef.current.on("can start game", () => {
      setPlayState();
      setGameStarted(true);
    });
    socketRef.current.on("cannot start game", () => {
      setWaitingState();
    });
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
        <RoomInfo
          connectedTeams={connectedTeams}
          roomNumber={roomNumber}
          teamName={teamName}
          message={message}
        />
        <Playground
          round={round}
          gameStarted={gameStarted}
          play={play}
          roomNumber={roomNumber}
          roundData={roundData}
          message={message}
          connectedTeams={connectedTeams}
          isFacilitator={isFacilitator}
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
        anyConnectionError={anyConnectionError}
        handleCheck={handleCheck}
        message={message}
        isFacilitator={isFacilitator}
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
