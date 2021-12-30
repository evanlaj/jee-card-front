import React from 'react';
import {useState} from 'react';

import Card from '../components/Card';

import './css/MemoryApp.css';


const baseCards = [
  {value:'K', color:'♥'},
  {value:'Q', color:'♦'},
  {value:'J', color:'♣'},
  {value:'10', color:'♠'},
  {value:'9', color:'♥'},
  {value:'8', color:'♠'}
]

function MemoryApp() {
  // state where we save the cards
  const [cards, setCards] = useState([]);
  // state to save the number of turns
  const [turns, setTurns] = useState(0);

  // shuffle cards, called everytime we start a new game
  // (including the time when we click on the button)
  const shuffleCards = () => {
    // duplicating the cards
    const shuffledCards = [...baseCards, ...baseCards]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({...card, id: Math.random()})) // add an id to every card

    //saving those shuffled cards into the state
    setCards(shuffledCards);
    //the number of turns comes back to 0 at every game
    setTurns(0);
  }

  return (
    <div className="App">
      <h1>Memory</h1>
      <button onClick={shuffleCards}>New Game</button>

      <div className="card-grid">
        {cards.map(card => (
          <Card
            key={card.id}
            color ={card.color}
            value ={card.value}
            visible="false"
          />
        ))}
      </div>
    </div>
  );
}


export default MemoryApp;
