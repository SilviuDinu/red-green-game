import Buttons from "./Buttons";
import Round from "./Round";

export default function Playground(props) {
  return (
    <div className="playground">
      <Round round={props.round} />
      <Buttons />
    </div>
  );
}
