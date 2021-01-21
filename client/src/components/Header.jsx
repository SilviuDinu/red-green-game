export default function Header(props) {
  function openGameRules() {
    window.open("./about.pdf", "_blank");
  }
  return (
    <header className="App-header">
      <h1>Red / Green Game</h1>
      <button onClick={openGameRules}>About</button>
    </header>
  );
}
