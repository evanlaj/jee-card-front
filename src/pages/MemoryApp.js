import React from 'react';

import Card from '../components/Card';
import { getShuffledMemoryDeck } from '../scripts/cards-util';

import './css/MemoryApp.css';

class MemoryApp extends React.Component {

  cards = [];
  nbTurns = 0;
  choiceOne;
  choiceTwo;
  currentCard;
  cardElements;

  showCardButton;

  constructor() {
    super();

    this.currentCard = null;
    this.choiceOne   = null;
    this.choiceTwo   = null;
    this.cardElements = [];

    this.memoryCardWrappers = React.createRef([]);
  }

  showCard(card) {
    console.log("bonjour");
    if(card == null) return;
    this.card.visible = true;
    this.forceUpdate();
  }

  // called everytime we start a new game using the button, gets a shuffled deck and nbTurn goes back to 0
  startGame() {
    this.cards = getShuffledMemoryDeck();
    this.nbTurns = 0;
    this.cardElements = [];

    for(let i = 0; i < this.cards.length; i++){
      this.cardElements.push((
        <div className="memory-card-wrapper">
          <Card color={this.cards[i].color} value={this.cards[i].value} visible={this.cards[i].visible} />
        </div>
      ));
      console.log(this.cardElements[i]);
      //this.cardElements[i].addEventListener("click", () => { this.showCard(this.cards[i]) });
    }
  
    this.forceUpdate();
  }

  render() {
       
    return (
      <div className="App">
        <h1>Memory</h1>
        <button onClick={() => this.startGame()}>New Game</button>
        <div className="card-grid" ref={this.showCardButton}>
          {this.cardElements}
        </div>
      </div>
    );
  }
}

export default MemoryApp;
