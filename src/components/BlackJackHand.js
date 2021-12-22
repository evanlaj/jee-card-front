import './css/BlackJackHand.css';
import React from 'react';

import Card from './Card';

class BlackJackHand extends React.Component {

  constructor(props) {
    super();
    
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

  render() {

    this.pushCard({ color:"♦", value:"7" });
    this.pushCard({ color:"♠", value:"2" });
    this.pushCard({ color:"♥", value:"K" });
    this.pushCard({ color:"♣", value:"1" });

    let hand = [];

    for(let card of this.cardList) {
      hand.push(<Card key={Math.random()} color={card.color} value={card.value} />);
    }

    return (
      <div className="bj-hand-wrapper" cards-value={this.cardsValue}>
        <div className="bj-hand">{hand}</div>
      </div>
    );
  }

}

export default BlackJackHand;
