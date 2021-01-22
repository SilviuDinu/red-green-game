
export default function LandingPage(props) {
  return (
    <>
      <div className="join-game-wrapper">
        <form onSubmit={(event) => props.connect(event, props.roomNumber, props.teamName)} className="join-game-form ">
          <input type="text" required onChange={event => props.onChangeRoomNumber(event)} value={props.roomNumber} placeholder="Enter the room number you want to join..."/>
          <input type="text" required onChange={event => props.onChangeTeamName(event)} value={props.teamName} placeholder="Enter a name for your team..."/>
          <button type="submit" className="green">
            Join Game
          </button>
        </form>
      </div>
    </>
  );
}
