import './css/BlackJackHand.css';
import React from 'react';

import Card from './Card';

class BlackJackApp extends React.Component {

  pushCard(card) {
    this.cardList.push(card);
  }

  getNbCard() {
    return this.cardList.length;
  }

  render() {
    return (
      <div className="bj-hand">
        <Card color="♦" value="7" visible={true} />
        <Card color="♠" value="2" visible={true} />
        <Card color="♥" value="K" visible={true} />
      </div>
    );
  }

}

export default BlackJackApp;
