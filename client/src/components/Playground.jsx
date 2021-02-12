import Buttons from "./Buttons";
import RoundTitle from "./RoundTitle";
import RoundInfo from "./RoundInfo";
import Message from "./Message";

export default function Playground(props) {
  function playChoice(option) {
    if (props.gameStarted) {
      props.play(props.round, props.roomNumber, props.teamName, option, props.score);
    }
  }
  let playgroundBody;
  if (props.showButtons && !props.showWaiting) {
    playgroundBody = <Buttons play={playChoice} isFacilitator={props.isFacilitator} />;
  } else {
    playgroundBody = <Message type="message" elem="p" message={"Waiting for other teams..."} />;
  }
  return (
    <div className="playground">
      {!props.hasGameEnded ? <RoundTitle round={props.round} /> : null}
      {!props.hasGameEnded ? playgroundBody : <Message type="message" elem="p" message={"The game is over. Check the scoreboard below."} />}
      {props.roundData && props.roundData.length > 0 ? (
        <RoundInfo
          round={props.round}
          roundData={props.roundData}
          connectedTeams={props.connectedTeams}
          teamName={props.teamName}
          hasGameEnded={props.hasGameEnded}
        />
      ) : (
        <Message type="message" elem="p" message={"Finish the round to see scores..."} />
      )}
    </div>
  );
}
