import Message from "./Message";

export default function RoundInfo(props) {
  const renderCurrentRoundChoices = choices => {
    let sortedChoices = [];
    props.connectedTeams.forEach(team => {
      choices.forEach((choice, index) => {
        if (choice.teamName === team.teamName) {
          sortedChoices.push(
            <td key={index} className={choice.choice}>
              {choice.score}
            </td>
          );
        }
      });
    });
    return sortedChoices;
  };

  const renderFinalScore = (rounds, team, index) => {
    let finalScores = [];
    let score = 0;
    rounds.forEach(round => {
      round.choices.forEach((choice, index) => {
        if (choice.teamName === team.teamName && !team.isFacilitator) {
          score += choice.score;
        }
      });
    });
    finalScores.push(<td key={index}>{score}</td>);
    return finalScores;
  };
  return (
    <div className="round-info container">
      <Message type="message" message="Score board" elem="h2" />
      <table className="score">
        <thead>
          <tr>
            <th>Round</th>
            {props.connectedTeams.map((elem, index) => {
              return elem.isFacilitator === false ? <th key={index}>{elem.teamName}</th> : null;
            })}
          </tr>
        </thead>
        <tbody>
          {props.roundData.map((elem, index) => {
            return elem.choices.length > 2 ? (
              <tr key={index}>
                <td>{elem.round}</td>
                {renderCurrentRoundChoices(elem.choices)}
              </tr>
            ) : null;
          })}
          <tr>
            <td>Final</td>
            {props.connectedTeams.map((elem, index) => {
              return elem.isFacilitator === false ? renderFinalScore(props.roundData, elem, index) : null;
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
