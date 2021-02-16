import Message from "./Message";

export default function RoomInfo(props) {
  return (
    <>
      <Message type="message" elem="h3" message={"Welcome to room " + props.roomNumber + ', ' + props.teamName} />
      <div>
        {props.connectedTeams.map((elem, index) => {
          return <p key={index} className={elem.teamName === props.teamName ? "me" : "player"}>{elem.isFacilitator ?  elem.teamName + " (f)" : elem.teamName}</p>;
        })}
      </div>
    </>
  );
}
