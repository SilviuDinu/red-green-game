import { useState } from "react";
import Buttons from "./Buttons";
import Round from "./Round";

export default function Playground(props) {
  const [round, setRound] = useState(1);
  return (
    <div className="playground">
      <Round round={round} />
      <Buttons />
    </div>
  );
}
