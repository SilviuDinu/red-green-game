import Message from "./Message";

export default function Buttons(props) {
  return (
    <div className="buttons-wrapper">
      {!props.isFacilitator ? (
        <>
          <button className="play-button red" onClick={() => props.play("red")}>
            Red
          </button>
          <button
            className="play-button green"
            onClick={() => props.play("green")}
          >
            Green
          </button>
        </>
      ) : (
        <Message
          type="message"
          message={
            "As facilitator, you cannot vote. You need to wait till the end of the round to discuss with the teams."
          }
        />
      )}
    </div>
  );
}
