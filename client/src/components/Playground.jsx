import Buttons from "./Buttons";
import Round from "./Round";

export default function Playground(props) {
  function playChoice(option) {
    if (props.gameStarted) {
      props.play(props.round, props.roomNumber, props.teamName, option);
    }
  }
  let playgroundBody;
  if (props.showButtons) {
    playgroundBody =  <Buttons play={playChoice} />; 
  } else if (props.showWaiting) {
    playgroundBody = <p>Waiting for the other teams...</p>;
  }
  return (
    <div className="playground">
      <Round round={props.round} />
      {playgroundBody}
    </div>
  );
}
