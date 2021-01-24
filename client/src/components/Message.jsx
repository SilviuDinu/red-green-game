export default function Message(props) {
  return (
    <div className={props.type}>
        <p>{props.message}</p>
    </div>
  );
}
