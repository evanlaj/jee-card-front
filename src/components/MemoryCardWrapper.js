import React from 'react';

import Card from './Card';

class MemoryCardWrapper extends React.Component {
  
  constructor() {
      super();

      this.choiceOne = null;
  }
  
  setCard(card) {
    this.currentCard = card;
    this.forceUpdate();
  }

  toggleVisible() {
    if(!this.currentCard) return;

    if(this.choiceOne == null && !this.currentCard.visible) { this.currentCard.visible = true; this.choiceOne = this.currentCard; console.log(this.choiceOne);}
    console.log(this.choiceOne);
    if(this.choiceOne != null && !this.currentCard.visible) {
        this.currentCard.visible= true;
        if ((!this.choiceOne.color === this.currentCard.color) && (this.choiceOne.value === this.currentCard.value)) {
            setTimeout(function() { this.setState({render: true})}.bind(this), 1000); // timer of one second
            this.choiceOne.visible = false;
            this.currentCard.visible = false;
            this.choiceOne = null;
            this.forceUpdate();
        }
    }
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
