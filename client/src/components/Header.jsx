import React from 'react'

export default class Header extends React.Component {
  openGameRules() {
    window.open("./about.pdf", '_blank');
  }
  render() {
    return (
      <header className="App-header">
        <h1>Red / Green Game</h1>
        <button onClick={this.openGameRules}>About</button>
      </header>
    );
  }
}
