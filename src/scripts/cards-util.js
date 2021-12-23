const DECK = [
  { color:"♦", value:"1" },
  { color:"♦", value:"2" },
  { color:"♦", value:"3" },
  { color:"♦", value:"4" },
  { color:"♦", value:"5" },
  { color:"♦", value:"6" },
  { color:"♦", value:"7" },
  { color:"♦", value:"8" },
  { color:"♦", value:"9" },
  { color:"♦", value:"10"},
  { color:"♦", value:"J" },
  { color:"♦", value:"Q" },
  { color:"♦", value:"K" },
  { color:"♥", value:"1" },
  { color:"♥", value:"2" },
  { color:"♥", value:"3" },
  { color:"♥", value:"4" },
  { color:"♥", value:"5" },
  { color:"♥", value:"6" },
  { color:"♥", value:"7" },
  { color:"♥", value:"8" },
  { color:"♥", value:"9" },
  { color:"♥", value:"10"},
  { color:"♥", value:"J" },
  { color:"♥", value:"Q" },
  { color:"♥", value:"K" },
  { color:"♣", value:"1" },
  { color:"♣", value:"2" },
  { color:"♣", value:"3" },
  { color:"♣", value:"4" },
  { color:"♣", value:"5" },
  { color:"♣", value:"6" },
  { color:"♣", value:"7" },
  { color:"♣", value:"8" },
  { color:"♣", value:"9" },
  { color:"♣", value:"10"},
  { color:"♣", value:"J" },
  { color:"♣", value:"Q" },
  { color:"♣", value:"K" },
  { color:"♠", value:"1" },
  { color:"♠", value:"2" },
  { color:"♠", value:"3" },
  { color:"♠", value:"4" },
  { color:"♠", value:"5" },
  { color:"♠", value:"6" },
  { color:"♠", value:"7" },
  { color:"♠", value:"8" },
  { color:"♠", value:"9" },
  { color:"♠", value:"10"},
  { color:"♠", value:"J" },
  { color:"♠", value:"Q" },
  { color:"♠", value:"K" }
];

function getFullDeck() {
  return [...DECK];
}

//Deprecated, use getShuffle(getFullDeck()) for same effect
function getShuffledDeck() { 
  let newList = [];

  let oldList = [...DECK];

  while(oldList.length !== 0) {
      let cardIndex = Math.floor(Math.random() * oldList.length);
      let card = oldList[cardIndex];
      oldList.splice(cardIndex, 1);

      newList.push(card);
  }

  return newList;
}

//Return a NEW deck which is a shuffle from the original deck
function getShuffle(deck) {
  let newList = [];

  let oldList = [...deck];

  while(oldList.length !== 0) {
      let cardIndex = Math.floor(Math.random() * oldList.length);
      let card = oldList[cardIndex];
      oldList.splice(cardIndex, 1);

      newList.push(card);
  }

  return newList;
}

function getMultipleDecks(nbDecks) {
  let newList = [];

  for(let i = 0; i < nbDecks; i++)
    newList = newList.concat([...DECK]);

  return newList;
}

export { getFullDeck, getShuffledDeck, getMultipleDecks, getShuffle };
