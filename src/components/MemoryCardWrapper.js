import React from 'react';

import Card from './Card';

class MemoryCardWrapper extends React.Component {
  
  constructor() {
      super();

      this.state = {
        choiceOne : null
      };
  }
  
  setCard(card) {
    this.currentCard = card;
    this.forceUpdate();
  }

  async toggleVisible() {
    if(!this.currentCard) return;

    //if it's the first card we chose in a pair
    if(this.state.choiceOne == null && !this.currentCard.visible) { 
      this.currentCard.visible = true;
      let currCard = this.currentCard;
      this.setState((state) => ({ 
          choiceOne: currCard
      }), () => {console.log(this.state.choiceOne);});
    }
    console.log(this.state.choiceOne);

    //if it's the second card we choose in a pair
    if(this.state.choiceOne != null && !this.currentCard.visible) {
        this.currentCard.visible= true;
        //if it's the wrong pair
        if ((this.state.choiceOne.color !== this.currentCard.color) || (this.choiceOne.value !== this.currentCard.value)) {
          setTimeout(function() { this.setState({render: true})}.bind(this), 1000); // timer of one second
          this.currentCard.visible = false;
          let firstChoice = this.state.choiceOne;
          firstChoice.visible = false;
          this.setState((state) => ({ 
            choiceOne: null
          }));
        }

        //if it's the wright pair
        if((this.state.choiceOne.color === this.currentCard.color) && (this.choiceOne.value === this.currentCard.value)) {
          //gérer le score
          this.setState((state) => ({ 
            choiceOne: null
          }));
        }
        
    }
  }

  returnCard() {
    if(!this.currentCard) return null;
    return {...this.currentCard};
  }

  componentDidMount() {
    this.toggleVisible();
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
