import './css/Card.css';
import React from 'react';

class CardPile extends React.Component {

  cardList;
  
  constructor({cards}) {
    super();

    this.cardList = cards;
  }

  shufflePile() {
    let newList = [];

    let oldList = [...this.cardList];

    while(oldList.length != 0) {
        let cardIndex = Math.random() * oldList.length;
        let card = oldList[cardIndex];
        oldList.splice(cardIndex, 1);

        newList.push(card);
    }

    this.cardList = newList;
  }

  shiftCard() {
      if(this.cardList.length == 0) return null;

      let card = this.cardList[0];
      this.cardList.shift();

      return card;
  }

  pushCard(card) {
    this.cardList.push(card);
  }

  render() {
    return (
        <div className="card-pile"></div>
    );
  }

}

export default CardPile;
