import React from 'react';
import { getFullDeck } from '../scripts/cards-util';

import Card from '../components/Card';
import CardPile from '../components/CardPile';

import './css/TestApp.css';

class App extends React.Component {

  pile = getFullDeck();
  
  currentCard;
  cardPile;

  constructor() {
    super();
    this.currentCard = null;
    this.cardPile = React.createRef();
    this.newCardButton = React.createRef();
    this.showCardButton = React.createRef();
  }

  newCard() {
    let newCard = this.cardPile.current.shiftCard();
    if (!newCard) return;

    newCard.visible = false;
    newCard.key = Math.random();
    this.currentCard = newCard;
    
    this.forceUpdate();
  }

  showCard() {
    if (this.currentCard) this.currentCard.visible = true;
    this.forceUpdate();
  }

  componentDidMount() {
    this.cardPile.current.shufflePile();

    this.newCardButton.current.addEventListener("click", () => { this.newCard() });
    this.showCardButton.current.addEventListener("click", () => { this.showCard() });
  }

  render() {
    return (
      <div className="App">
            <div ref={this.newCardButton}><CardPile ref={this.cardPile} cards={this.pile}/></div>
            <div className="card-slot" ref={this.showCardButton}>{ this.currentCard ?
              <Card key={this.currentCard.key} color={this.currentCard.color} value={this.currentCard.value} visible={this.currentCard.visible} /> : ""
            }</div>
      </div>
    );
  }
}

export default App;
