export default function RoomInfo(props) {
  return (
    <>
      <h3>Welcome to room {props.roomNumber}</h3>
      <ul>
        {props.connectedTeams.map((elem, index) => {
          return <li key={index}>{elem}</li>;
        })}
      </ul>
    </>
  );
}
