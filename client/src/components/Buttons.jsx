export default function Buttons(props) {
  return (
    <div className="buttons-wrapper">
      <button className="play-button red" onClick={() => props.play("red")}>
        Red
      </button>
      <button className="play-button green" onClick={() => props.play("green")}>
        Green
      </button>
    </div>
  );
}
