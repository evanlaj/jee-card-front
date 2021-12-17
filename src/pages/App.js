import './css/App.css';
import Card from '../components/Card';
import CardPile from '../components/CardPile';

import React from 'react';

class App extends React.Component {

  pile = [
    <Card color="♦" value="J" />,
    <Card color="♥" value="K" />,
    <Card color="♣" value="2" />,
    <Card color="♠" value="2" />,
    <Card color="♦" value="10"/>
  ];
  
  currentCard;
  cardPile;

  constructor() {
    super();
    this.currentCard = null;
    this.cardPile = React.createRef();
  }

  newCard() {
    this.currentCard = this.cardPile.current.shiftCard()
  }

  componentDidMount() {
    console.log(this);
    this.cardPile.current.shufflePile();

    this.cardPile.current.addEventListener("onclick", () => {
      this.newCard();
    });
  }

  render() {
    return (
      <div className="App">
            <CardPile ref={this.cardPile} cards={this.pile}/>
            <div>
              {this.currentCard}
            </div>
      </div>
    );
  }
}

export default App;
