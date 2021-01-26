import Message from "./Message";

export default function LandingPage(props) {
  return (
    <>
      <div className="join-game-wrapper">
        <form
          onSubmit={event => props.connect(event, props.roomNumber, props.teamName, props.isFacilitator, false, null, null)}
          className="join-game-form ">
          <input
            type="text"
            required
            className="text"
            onChange={event => props.onChangeRoomNumber(event)}
            value={props.roomNumber}
            placeholder="Enter the room number you want to join..."
          />
          <input
            type="text"
            className="text"
            required
            onChange={event => props.onChangeTeamName(event)}
            value={props.teamName}
            placeholder="Enter a name for your team..."
          />
          <div>
            <p className="facilitator-check">Check this box if you're the facilitator</p>
            <input className="check" type="checkbox" onClick={props.handleCheck} />
          </div>
          <button type="submit" className="join">
            Join Game
          </button>
        </form>
        {props.canReJoin ? (
          <>
            <Message elem="p" type="message" message={`You were preivously inside another room. Would you like to join back?`} />
            <button onClick={props.tryReJoin} className="join">
              Join back
            </button>
          </>
        ) : null}
        {props.anyConnectionError ? <Message elem="p" type="error" message={props.message} /> : null}
      </div>
    </>
  );
}
