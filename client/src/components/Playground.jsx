import Buttons from "./Buttons";
import RoundTitle from "./RoundTitle";
import RoundInfo from "./RoundInfo";

export default function Playground(props) {
  console.log(props.roundData);
  function playChoice(option) {
    if (props.gameStarted) {
      props.play(props.round, props.roomNumber, props.teamName, option);
    }
  }
  let playgroundBody;
  if (props.showButtons) {
    playgroundBody = <Buttons play={playChoice} />;
  } else if (props.showWaiting) {
    playgroundBody = <p>Waiting for the other teams...</p>;
  }
  return (
    <div className="playground">
      <RoundTitle round={props.round} />
      {playgroundBody}
      {props.roundData && props.roundData.length > 0 ? (
        <RoundInfo
          round={props.round}
          roundData={props.roundData}
          connectedTeams={props.connectedTeams}
        />
      ) : <p>Finish the round to see scores...</p>}
    </div>
  );
}
