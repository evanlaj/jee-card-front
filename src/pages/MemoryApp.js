import React from 'react';

import MemoryCardWrapper from '../components/MemoryCardWrapper';
import { getShuffle, getMemoryDeck } from '../scripts/cards-util';

import './css/MemoryApp.css';

class MemoryApp extends React.Component {

  cards = [];
  nbTurns = 0;
  memoryCardList;

  constructor() {
    super();

    this.memoryCardWrappers = [];

    this.memoryCardList = [];
    for(let i = 0; i < 12; i++) {
      this.memoryCardList.push(<MemoryCardWrapper ref={(elem) => this.memoryCardWrappers.push(elem)}/>)
    }
    
  }

  // called everytime we start a new game using the button, gets a shuffled deck and nbTurn goes back to 0
  startGame() {
    this.cards = getShuffle(getMemoryDeck());
    this.nbTurns = 0;

    for(let i = 0; i < this.cards.length; i++) {
      this.memoryCardWrappers[i].setCard(this.cards[i]);
    }
  
    this.forceUpdate();
  }

  render() {
    return (
      <div className="App">
        <h1>Memory</h1>
        <button onClick={() => this.startGame()}>New Game</button>
        <div className="card-grid">
          {this.memoryCardList}
        </div>
      </div>
    );
  }
}

export default MemoryApp;
