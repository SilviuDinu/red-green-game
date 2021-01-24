import Message from "./Message";

export default function RoomInfo(props) {
  return (
    <>
      <Message type="message" message={"Welcome to room " + props.roomNumber + ', ' + props.teamName} />
      <ul>
        {props.connectedTeams.map((elem, index) => {
          return <li key={index}>{elem.teamName}</li>;
        })}
      </ul>
    </>
  );
}
