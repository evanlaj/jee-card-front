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

export { getFullDeck, getShuffledDeck };
