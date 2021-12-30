import './css/BlackJackHand.css';
import React from 'react';

import Card from './Card';

class BlackJackHand extends React.Component {

  constructor({showTotalValue = false, dealerHand = false}) {
    super();
    
    this.showTotalValue = showTotalValue;
    this.dealerHand = dealerHand;
    this.secondHidden = dealerHand;

    this.cardList = [];
    this.cardsValue = 0;
  }
  
  pushCard(card) {
    let newCard = {...card}; // (clone card)

    newCard.bjValue = (newCard.value.match(/^(K|Q|J)$/) ? 10 : parseInt(newCard.value));
    if(newCard.value === "1") newCard.bjValue = 11;

    this.cardList.push(newCard);

    this.cardsValue += newCard.bjValue;

    //change hand value if total > 21 && player has 11.
    while(this.cardsValue > 21 && this.cardList.find(card => card.bjValue === 11)) {
      this.cardList.find(card => card.bjValue === 11).bjValue = 1;
      this.cardsValue -= 10;
    }
  }

  getNbCard() {
    return this.cardList.length;
  }

  getValue() {
    return this.cardsValue;
  }

  reveal() {
    this.secondHidden = false;
  }

  emptyHand() {
    let tempList = [...this.cardList];

    this.secondHidden = this.dealerHand;
    this.cardList = [];
    this.cardsValue = 0;

    return tempList;
  }

  render() {

    let hand = [];
    let handValue = this.cardsValue;
    
    if(this.secondHidden && this.cardList.length === 2) {
      hand.push(<Card key={0} color={this.cardList[0].color} value={this.cardList[0].value}/>);
      hand.push(<Card key={1} visible={false}/>);
      handValue = this.cardList[0].bjValue + " + ?";
    }
    else for(let i = 0; i < this.cardList.length; i++) {
      let card = this.cardList[i];
      hand.push(<Card key={i} color={card.color} value={card.value} />);
    }

    if (this.showTotalValue) 
      return (
        <div className="bj-hand-wrapper" cards-value={handValue} >
          <div className="bj-hand">{hand}</div>
        </div>
      );
    else
      return (<div className="bj-hand">{hand}</div>);
  }

}

export default BlackJackHand;
