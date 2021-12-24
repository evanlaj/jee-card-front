import React from 'react';
import { delay } from '../scripts/anim-util';

import Card from './Card';

import './css/WarBoard.css';

class WarBoard extends React.Component {

  constructor() {
    super();

    this.cardList = [];
  }
  
  pushCard(card) {
    let newCard = {...card}; // (clone card)
    this.cardList.push(newCard);
  }

  getValue() {
    let card = this.cardList[this.cardList.length-1];
    if(!card) return 0;

    let value = 0;

    switch (card.value) {
      case '1' : value = 14;
                 break;
      case 'K' : value = 13;
                 break;
      case 'Q' : value = 12;
                 break;
      case 'J' : value = 11;
                 break;
      default : value = parseInt(card.value);
    }

    return value;
  }

  async reveal() {
    for(let card of this.cardList) {
      if(!card.visible) {
        card.visible = true;
        this.forceUpdate();
        await delay(200);
      }
    }
  }

  //only used if the player has only 2n cards left to do a 2n+1 war
  async revealLast() {
    this.cardList[this.cardList.length-1].visible = true;
    this.forceUpdate();
    await delay(200);
  }

  emptyBoard() {
    let tempList = [...this.cardList];

    this.cardList = [];

    return tempList;
  }

  render() {

    let hand = [];
    
    for(let i = 0; i < this.cardList.length; i++) {
      let card = this.cardList[i];
      hand.push(<Card key={i} color={card.color} value={card.value} visible={card.visible}/>);
    }

    return (<div className="war-board">{hand}</div>);
  }

}

export default WarBoard;
