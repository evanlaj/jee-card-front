import './css/CardPile.css';
import React from 'react';

class CardPile extends React.Component {
  
  constructor({cards, showCounter = true}) {
    super();

    this.cardList = cards;
    this.showCounter = showCounter;
  }

  shufflePile() {
    let newList = [];

    let oldList = [...this.cardList];

    while(oldList.length !== 0) {
        let cardIndex = Math.floor(Math.random() * oldList.length);
        let card = oldList[cardIndex];
        oldList.splice(cardIndex, 1);

        newList.push(card);
    }

    this.cardList = newList;
  }

  shiftCard() {
      if(this.cardList.length === 0) return null;

      let card = this.cardList[0];
      this.cardList.shift();

      return card;
  }

  pushCard(card) {
    this.cardList.push(card);
  }

  getNbCard() {
    return this.cardList.length;
  }

  render() {
    
    let cardPile = (<div className={"card-pile c" + this.cardList.length + "-left"}></div>);
    
    if (this.showCounter) return (<div className="show-card" nbcard={this.cardList.length}>{cardPile}</div>);
    else return cardPile;
  }

}

export default CardPile;
