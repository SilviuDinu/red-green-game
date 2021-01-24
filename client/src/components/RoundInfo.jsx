export default function RoundInfo(props) {
  const renderCurrentRoundChoices = (choices) => {
    let sortedChoices = [];
    props.connectedTeams.forEach((team) => {
      choices.forEach((choice, index) => {
        if (choice.teamName === team.teamName) {
          sortedChoices.push(<td key={index}>{choice.choice}</td>);
        }
      });
    });
    return sortedChoices;
  };
  return (
    <div className="container">
      <span>Score board</span>
      <table className="score">
        <thead>
          <tr>
            <th>Round</th>
            {props.connectedTeams.map((elem, index) => {
              return elem.isFacilitator === false ? (
                <th key={index}>{elem.teamName}</th>
              ) : null;
            })}
          </tr>
        </thead>
        <tbody>
          {props.roundData.map((elem, index) => {
            return (
              <tr key={index}>
                <td>{elem.round}</td>
                {renderCurrentRoundChoices(elem.choices)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
