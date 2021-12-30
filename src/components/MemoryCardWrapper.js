import React from 'react';

import Card from './Card';

class MemoryCardWrapper extends React.Component {
  
  setCard(card) {
    this.currentCard = card;
    this.forceUpdate();
  }

  toggleVisible() {
    if(!this.currentCard) return;
    if(!this.currentCard.visible) this.currentCard.visible = true;
    else this.currentCard.visible = !this.currentCard.visible;
    this.forceUpdate();
  }

  returnCard() {
    if(!this.currentCard) return null;
    return {...this.currentCard};
  }

  render() {
    return(
        <div className="memory-card-wrapper" onClick={() => this.toggleVisible()}>
        {this.currentCard ?
        <Card value={this.currentCard.value} color={this.currentCard.color} visible={this.currentCard.visible}/> : ""}
        </div>
    );
  }

}

export default MemoryCardWrapper;
