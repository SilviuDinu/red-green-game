import "./App.css";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import RoomInfo from "./components/RoomInfo";
import Playground from "./components/Playground";
import Loader from "./components/Loader";
import { useState, useRef, useEffect } from "react";
import io from "socket.io-client";

function App() {
  const [connected, setConnected] = useState(false);
  const [connectedTeams, setConnectedTeams] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [anyConnectionError, setAnyConnectionError] = useState(false);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [roundData, setRoundData] = useState([]);
  const [roundProgress, setRoundProgress] = useState([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [teamName, setTeamName] = useState("");
  const [showButtons, setShowButtons] = useState(true);
  const [showWaiting, setShowWaiting] = useState(true);
  const [isFacilitator, setIsFacilitator] = useState(false);
  const [message, setMessage] = useState("");
  const [canReJoin, setCanReJoin] = useState(
    sessionStorage.getItem("PREV_STATE") ? JSON.parse(sessionStorage.getItem("PREV_STATE")).canReJoin : false
  );
  const [loading, setLoading] = useState(false);
  const [hasGameEnded, setHasGameEnded] = useState(false);
  const socketRef = useRef();

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("/", { transports: ["polling"] });
    }
    socketRef.current.on("finish_round", data => {
      setRoundData(data.rounds);
      setRoundProgress(data.rounds);
      setPlayState();
      setRound(round => round + 1);
    });
    socketRef.current.on("finish_game", data => {
      sessionStorage.removeItem("PREV_ITEM");
      setCanReJoin(false);
      setHasGameEnded(true);
    });
  }, []);

  useEffect(() => {
    if (connected) {
      sessionStorage.setItem(
        "PREV_STATE",
        JSON.stringify({
          connected: connected,
          connectedTeams: connectedTeams,
          gameStarted: gameStarted,
          anyConnectionError: anyConnectionError,
          round: round,
          score: score,
          roundData: roundData,
          roundProgress: roundProgress,
          roomNumber: roomNumber,
          teamName: teamName,
          showButtons: showButtons,
          showWaiting: showWaiting,
          isFacilitator: isFacilitator,
          message: message,
          canReJoin: canReJoin,
          hasGameEnded: hasGameEnded,
        })
      );
    }
  });

  const reJoinRoom = async () => {
    if (sessionStorage.getItem("PREV_STATE")) {
      const prevState = await JSON.parse(sessionStorage.getItem("PREV_STATE"));

      setLoading(true);

      socketRef.current.emit("request_re_join", {
        roomNumber: parseInt(prevState.roomNumber),
        teamName: prevState.teamName,
        isFacilitator: prevState.isFacilitator,
      });
      socketRef.current.on("cannot_re_join", () => {
        sessionStorage.removeItem("PREV_ITEM");
        setCanReJoin(false);
        setLoading(false);
        return;
      });
      socketRef.current.on("can_re_join", async () => {
        setConnected(prevState.connected);
        setConnectedTeams(prevState.connectedTeams);
        setGameStarted(prevState.gameStarted);
        setAnyConnectionError(prevState.anyConnectionError);
        setRound(prevState.round);
        setScore(prevState.score);
        setRoundData(prevState.roundData);
        setRoundProgress(prevState.roundProgress);
        setRoomNumber(prevState.roomNumber);
        setTeamName(prevState.teamName);
        setShowButtons(prevState.showButtons);
        setShowWaiting(prevState.showWaiting);
        setIsFacilitator(prevState.isFacilitator);
        setMessage(prevState.message);
        setCanReJoin(prevState.canReJoin);
        setHasGameEnded(prevState.hasGameEnded);
        setLoading(false);
        connect(
          null,
          prevState.roomNumber,
          prevState.teamName,
          prevState.isFacilitator,
          true,
          prevState.roundProgress || roundProgress,
          prevState.round || round
        );
      });
    }
  };

  const handleCheck = () => {
    setIsFacilitator(!isFacilitator);
  };

  const connect = async (e, roomNumber, teamName, facilitator, rejoin, roundProgress, round) => {
    setLoading(true);
    if (e) {
      e.preventDefault();
    }
    socketRef.current.emit("join_game", {
      roomNumber: parseInt(roomNumber),
      teamName: teamName,
      isFacilitator: facilitator,
      rejoin: rejoin,
    });
    socketRef.current.on("connection_error", error => {
      setLoading(false);
      setAnyConnectionError(true);
      setMessage(error);
    });
    socketRef.current.on("joined_teams_in_current_room", data => {
      setConnectedTeams(data[0].activeSessions);
      setAnyConnectionError(false);
      setConnected(true);
      setCanReJoin(true);
      setLoading(false);
    });
    socketRef.current.on("can_start_game", data => {
      if (!data) setPlayState();
      else {
        switch (facilitator) {
          case false:
            if (data.rounds && data.rounds[data.rounds.length - 1]) {
              if (
                data.rounds[data.rounds.length - 1].choices.length > 2 &&
                data.rounds[data.rounds.length - 1].choices.find(elem => elem.teamName === teamName)
              ) {
                setRound(data.rounds.length + 1);
                setPlayState();
              } else if (!data.rounds[data.rounds.length - 1].choices.find(elem => elem.teamName === teamName)) {
                setPlayState();
              } else {
                setWaitingState();
              }
            }
            setRoundData(data.rounds);
            setRoundProgress(data.rounds);
            break;
          default:
            setRound(data.rounds[data.rounds.length - 1].choices.length > 2 ? data.rounds.length + 1 : data.rounds.length);
            setRoundData(data.rounds);
            setRoundProgress(data.rounds);
        }
      }
      setGameStarted(true);
      setLoading(false);
    });
    socketRef.current.on("cannot_start_game", () => {
      setWaitingState();
      setLoading(false);
    });
  };

  const changeRoomNumber = e => {
    setRoomNumber(e.target.value);
  };

  const changeTeamName = e => {
    setTeamName(e.target.value);
  };

  const play = (round, roomNumber, teamName, choice, score) => {
    setWaitingState();
    socketRef.current.emit("start_game", {
      round: round,
      roomNumber: parseInt(roomNumber),
      teamName: teamName,
      choice: choice,
      score: score,
    });
    socketRef.current.on("started_game", roundInfo => {
      setRoundProgress(roundInfo.rounds);
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
        <RoomInfo connectedTeams={connectedTeams} roomNumber={roomNumber} teamName={teamName} message={message} />
        <Playground
          round={round}
          score={score}
          gameStarted={gameStarted}
          hasGameEnded={hasGameEnded}
          play={play}
          roomNumber={roomNumber}
          roundData={roundData}
          message={message}
          connectedTeams={connectedTeams}
          isFacilitator={isFacilitator}
          teamName={teamName}
          showButtons={showButtons}
          showWaiting={showWaiting}
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
        canReJoin={canReJoin}
        tryReJoin={reJoinRoom}
        onChangeRoomNumber={changeRoomNumber}
        onChangeTeamName={changeTeamName}
      />
    );
  }

  return (
    <div className="App">
      <Header />
      {loading ? <Loader /> : body}
    </div>
  );
}

export default App;
