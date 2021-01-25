export default function Message(props) {
  return (
    <div className={props.type}>
        <props.elem>{props.message}</props.elem>
    </div>
  );
}
