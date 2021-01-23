export default function RoundInfo(props) {
  return (
    <div className="container">
      <span>Score board</span>
      <table className="score">
        <thead>
          <tr>
            <th>Round</th>
            {props.connectedTeams.map((elem, index) => {
              return <th key={index}>{elem}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {props.roundData.map((elem, index) => {
            return (
              <tr key={index}>
                <td>{elem.round}</td>
                {
                  <td>
                    {elem.choices.map((e, i) => {
                      return (
                        <>
                          {e.teamName} - {e.choice}
                        </>
                      );
                    })}
                  </td>
                }
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
