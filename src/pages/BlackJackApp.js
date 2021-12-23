import React from 'react';
import { getShuffle, getMultipleDecks } from '../scripts/cards-util';
import { delay } from '../scripts/anim-util';

import BlackJackHand from '../components/BlackJackHand';
import CardPile from '../components/CardPile';
import EndModal from '../components/EndModal';

import './css/BlackJackApp.css';

class BlackJackApp extends React.Component {

  constructor() {
    super();
    this.pile = getShuffle(getMultipleDecks(6));
    this.pile.splice(-52, 52); //cut the bottom to prevent card counting

    this.leftovers = [];

    //Custom card pile for testing purpose
    /*this.pile = [
      { color:"♥", value:"10"},
      { color:"♥", value:"10"},
      { color:"♥", value:"10"},
      { color:"♥", value:"10"},
      { color:"♥", value:"10"},
      { color:"♥", value:"10"},
      { color:"♥", value:"10"},
      { color:"♥", value:"10"},
    ];*/

    this.dealerHand = React.createRef();
    this.playerHand = React.createRef();
    this.cardPile = React.createRef();

    this.hitButton = React.createRef();
    this.standButton = React.createRef();

    this.endModalInfo = {title: "", info: "", show: false};
  }

  componentDidMount() {
    this.initBoard();
  }

  async initBoard() {
    this.hitButton.current.addEventListener('click', () => this.drawPlayer());
    this.standButton.current.addEventListener('click', () => this.endPlayerTurn());

    await this.startGame();
  }

  async startGame() {

    //reset last game
    this.endModalInfo.show = false;
    this.forceUpdate();
    this.leftovers = this.leftovers.concat(this.playerHand.current.emptyHand());
    this.leftovers = this.leftovers.concat(this.dealerHand.current.emptyHand());
    
    this.playerCanPlay = false;
    //draw player hand
    this.playerHand.current.pushCard(this.drawCard());
    this.forceUpdate();
    await delay(500);
    this.playerHand.current.pushCard(this.drawCard());
    this.forceUpdate();
    await delay(500);

    //draw dealer hand
    this.dealerHand.current.pushCard(this.drawCard());
    this.forceUpdate();
    await delay(500);
    this.dealerHand.current.pushCard(this.drawCard());
    this.forceUpdate();

    //check for blackjack before allowing the player to play
    let playerScore = this.playerHand.current.getValue();
    let dealerScore = this.dealerHand.current.getValue();

    if(!(playerScore == 21 || dealerScore == 21)) this.playerCanPlay = true;
    else {
      await delay(500);
      this.showEndModal();
    }
  }

  async drawPlayer() {

    if(!this.playerCanPlay) return;

    //prevent spamming
    this.playerCanPlay = false;

    this.playerHand.current.pushCard(this.drawCard());
    this.forceUpdate();
    await delay(500);

    this.playerCanPlay = true;

    this.tryBustPlayer();
  }

  tryBustPlayer() {
    let playerScore = this.playerHand.current.getValue();

    if (playerScore > 20) {
      this.playerCanPlay = false;
      if (playerScore > 21) this.showEndModal();
      else this.playDealerTurn();
    }
  }

  endPlayerTurn() {
    if(!this.playerCanPlay) return;
    this.playerCanPlay = false;

    this.playDealerTurn();
  }

  async playDealerTurn() {
    this.dealerHand.current.reveal();
    this.forceUpdate();
    await delay(600);

    let playerScore = this.playerHand.current.getValue();
    let dealerScore = this.dealerHand.current.getValue();

    while((dealerScore < playerScore) || (dealerScore == playerScore && dealerScore < 17)) {
      this.dealerHand.current.pushCard(this.drawCard());
      dealerScore = this.dealerHand.current.getValue();
      this.forceUpdate();
      await delay(500);
    }

    this.showEndModal();
  }

  async showEndModal() {
    this.dealerHand.current.reveal();
    this.forceUpdate();

    let playerScore = this.playerHand.current.getValue();
    let dealerScore = this.dealerHand.current.getValue();

    let playerWon = (playerScore < 22 && playerScore > dealerScore) || (dealerScore > 21);

    await delay(500);
    this.endModalInfo.info = "Vous avez " + (playerWon ? "gagné":"perdu") +" avec un score de " + playerScore + " à " + dealerScore + ".";
    this.endModalInfo.title = "Victoire";
    this.endModalInfo.show = true;

    if(playerScore == dealerScore) {
      this.endModalInfo.info = "Il y a égalité (" + playerScore + " partout).";
      this.endModalInfo.title = "Égalité";
    }

    this.forceUpdate();
  }

  drawCard() {
    let card = this.cardPile.current.shiftCard();

    if(card) return card;

    let newPile = getShuffle(this.leftovers);

    this.cardPile.current.pushCards(newPile);
    this.leftovers = [];

    return this.drawCard();
  }

  render() {

    let endModal = null;
    
    if(this.endModalInfo.show)
      endModal = (<EndModal actionReplay={() => this.startGame()} info={this.endModalInfo.info}/>);

    return (
      <div className="BlackJackApp">
        <svg id="logo-blackjack" width="623" height="173" viewBox="0 0 623 173" >
          <path d="M19.57 9.569C19.6245 9.5698 19.6783 9.55751 19.7271 9.53314C19.7758 9.50878 19.818 9.47306 19.85 9.429C19.883 9.38352 19.9268 9.34692 19.9774 9.32249C20.028 9.29806 20.0839 9.28655 20.14 9.289C21.14 9.289 21.64 9.949 21.63 11.289C21.3033 61.9557 20.97 112.602 20.63 163.229C20.63 164.609 20.2 165.489 19.36 165.879C19 166.039 18.75 166.069 18.64 165.949C15.9558 164.722 13.0665 164.007 10.12 163.839C7.0377 163.643 3.94301 163.811 0.900002 164.339C0.300002 164.252 0 163.752 0 162.839V22.399C0 21.129 0.310002 20.469 0.940002 20.399C4.27275 19.2655 7.4824 17.798 10.52 16.019C13.7289 14.1524 16.7585 11.9932 19.57 9.569ZM23.7 10.749C23.4005 10.5952 23.1527 10.3568 22.9874 10.0635C22.8221 9.77023 22.7465 9.43486 22.77 9.099C22.7594 8.75016 22.8476 8.40544 23.0246 8.10463C23.2015 7.80382 23.4599 7.55919 23.77 7.399C27.6501 4.65137 32.2486 3.09767 37 2.929C39.4955 2.91369 41.9664 3.42298 44.2524 4.42387C46.5384 5.42477 48.5886 6.89491 50.27 8.739C53.98 12.569 55.76 18.579 55.63 26.919L55.38 43.229C55.3816 43.6053 55.2737 43.9739 55.0695 44.2899C54.8653 44.6059 54.5736 44.8558 54.23 45.009C50.902 46.2085 47.6973 47.7254 44.66 49.539C41.491 51.4274 38.5311 53.6465 35.83 56.159C35.7382 56.2693 35.6236 56.3586 35.4942 56.4207C35.3648 56.4828 35.2235 56.5163 35.08 56.519C34.21 56.649 33.78 56.139 33.79 54.969C33.91 43.769 33.96 38.169 34.08 26.969C34.1249 25.0103 34.0179 23.0511 33.76 21.109C33.5721 19.6661 33.074 18.2811 32.3 17.049C31.4499 15.8098 30.3746 14.7412 29.13 13.899C27.3969 12.7188 25.5823 11.6628 23.7 10.739V10.749ZM54.7 65.239C55.0345 65.2957 55.3343 65.4789 55.5373 65.7508C55.7403 66.0226 55.8308 66.3622 55.79 66.699C55.49 86.199 55.1867 105.696 54.88 125.189C54.75 133.369 52.82 140.079 49.09 145.559C45.36 151.039 41.02 154.899 36.09 157.009C32.0667 158.822 27.5606 159.268 23.26 158.279C22.66 158.199 22.39 157.719 22.46 156.829C22.505 155.99 22.8617 155.199 23.46 154.609C25.6467 152.489 27.41 150.656 28.75 149.109C29.9198 147.784 30.927 146.323 31.75 144.759C32.4542 143.332 32.93 141.803 33.16 140.229C33.443 138.242 33.5834 136.236 33.58 134.229C33.7667 116.009 33.9533 97.7923 34.14 79.579C34.14 78.7523 33.9 78.3023 33.42 78.229C31.6226 77.4765 29.8698 76.6217 28.17 75.669C26.5167 74.7357 24.83 73.7557 23.11 72.729C22.8635 72.5947 22.663 72.3894 22.5346 72.1398C22.4062 71.8901 22.3558 71.6076 22.39 71.329C22.3814 71.0092 22.4443 70.6916 22.5741 70.3992C22.7038 70.1069 22.8971 69.8472 23.14 69.639C26.4733 66.099 30.0267 62.4523 33.8 58.699C33.8777 58.5511 33.984 58.4201 34.1127 58.3137C34.2415 58.2072 34.3901 58.1275 34.55 58.079C34.67 58.079 34.85 58.209 35.1 58.499C37.9725 60.3999 41.0781 61.9224 44.34 63.029C47.683 64.1747 51.1509 64.9166 54.67 65.239H54.7Z"/>
          <path d="M90.25 107.639L88.56 108.739C88.3769 108.884 88.1562 108.973 87.924 108.996C87.6918 109.019 87.4579 108.975 87.25 108.869C87.0877 108.772 86.9534 108.634 86.8605 108.469C86.7676 108.304 86.7192 108.118 86.72 107.929L88.61 21.079C88.6641 20.7932 88.7822 20.5233 88.9554 20.2895C89.1286 20.0557 89.3523 19.8641 89.61 19.729C93.13 17.959 97.52 15.589 100.31 13.099C100.508 12.9056 100.663 12.6733 100.766 12.4169C100.869 12.1604 100.918 11.8853 100.91 11.609C100.918 11.3722 100.874 11.1365 100.781 10.9187C100.687 10.7009 100.547 10.5063 100.37 10.349C96.92 8.219 93.43 5.199 89.8 2.799C89.5667 2.67802 89.3078 2.61487 89.045 2.61487C88.7822 2.61487 88.5233 2.67802 88.29 2.799C82.86 5.849 75.01 10.339 68.29 12.319C67.9492 12.4363 67.6538 12.6578 67.4457 12.9521C67.2376 13.2463 67.1271 13.5986 67.13 13.959C66.4633 50.779 65.7967 87.5957 65.13 124.409C65.107 124.61 65.1453 124.813 65.2399 124.991C65.3345 125.17 65.481 125.315 65.66 125.409C70.55 127.729 75.56 132.709 79.03 138.409C79.35 138.939 79.94 138.969 80.5 138.559C87.5 133.359 90.96 130.869 97.97 126.089C104.76 121.539 107.7 122.009 112.8 128.089C112.975 128.308 113.229 128.45 113.508 128.484C113.787 128.518 114.068 128.44 114.29 128.269C114.781 127.898 115.133 127.374 115.29 126.779C118.44 113.029 105.55 95.009 90.25 107.639Z"/>
          <path d="M152.34 5.259C152.11 5.40213 151.918 5.59873 151.781 5.83206C151.643 6.06538 151.564 6.3285 151.55 6.59899C151.547 6.86172 151.634 7.11757 151.796 7.32467C151.957 7.53177 152.184 7.67785 152.44 7.73899C161.24 10.849 162.87 12.739 162.68 19.809C162.233 36.4757 161.787 53.1423 161.34 69.809C161.315 70.1146 161.209 70.408 161.034 70.6593C160.858 70.9106 160.618 71.1106 160.34 71.239C156.653 72.8225 153.072 74.643 149.62 76.689C149.412 76.7804 149.187 76.8276 148.96 76.8276C148.733 76.8276 148.508 76.7804 148.3 76.689C148.121 76.5792 147.976 76.4221 147.881 76.235C147.785 76.048 147.744 75.8383 147.76 75.629C148.367 53.2557 148.973 30.8857 149.58 8.51899C149.593 8.30028 149.551 8.08176 149.456 7.88406C149.362 7.68635 149.219 7.51597 149.04 7.38899C148.811 7.25447 148.55 7.18354 148.285 7.18354C148.02 7.18354 147.759 7.25447 147.53 7.38899C142.1 10.799 134.96 13.389 128.84 15.029C128.517 15.1087 128.228 15.2912 128.017 15.549C127.806 15.8069 127.684 16.1262 127.67 16.459C126.797 49.7457 125.923 83.0357 125.05 116.329C125.033 116.478 125.049 116.629 125.098 116.771C125.147 116.913 125.227 117.042 125.333 117.149C125.439 117.255 125.567 117.337 125.708 117.387C125.85 117.437 126.001 117.455 126.15 117.439C132.38 117.339 139.35 117.799 144.49 119.839C144.736 119.939 145.004 119.975 145.268 119.944C145.532 119.913 145.784 119.814 146 119.659C146.22 119.49 146.392 119.266 146.5 119.01C146.607 118.754 146.645 118.474 146.61 118.199L147.31 92.339C147.341 92.0262 147.449 91.7259 147.623 91.4643C147.797 91.2028 148.033 90.9881 148.31 90.839C151.7 88.929 155.76 86.889 159.04 85.079C159.249 84.983 159.475 84.9332 159.705 84.9332C159.935 84.9332 160.161 84.983 160.37 85.079C160.526 85.1594 160.658 85.2793 160.752 85.4268C160.847 85.5742 160.901 85.7439 160.91 85.919L160.31 108.329C160.301 108.474 160.323 108.62 160.375 108.755C160.428 108.891 160.509 109.013 160.614 109.114C160.719 109.215 160.844 109.292 160.982 109.34C161.119 109.387 161.265 109.404 161.41 109.389C167.693 109.442 173.935 110.409 179.94 112.259C180.177 112.357 180.435 112.395 180.69 112.368C180.945 112.342 181.19 112.252 181.401 112.107C181.613 111.962 181.785 111.766 181.902 111.538C182.018 111.309 182.076 111.055 182.07 110.799L184.44 20.099C185.44 2.519 164.83 -1.591 152.34 5.259Z"/>
          <path d="M214.76 8.319C209.02 11.439 201.84 14.499 196.08 15.189C195.763 15.2094 195.465 15.35 195.247 15.5822C195.03 15.8145 194.909 16.1209 194.91 16.439C194.243 44.299 193.55 72.1557 192.83 100.009C192.83 100.153 192.859 100.295 192.916 100.428C192.973 100.56 193.057 100.679 193.162 100.777C193.267 100.876 193.391 100.952 193.527 101C193.662 101.049 193.806 101.069 193.95 101.059C200.3 101.399 207.34 102.289 212.61 104.519C212.86 104.634 213.138 104.675 213.411 104.638C213.683 104.601 213.94 104.487 214.15 104.309C214.337 104.193 214.49 104.031 214.595 103.838C214.7 103.645 214.754 103.429 214.75 103.209C215.417 71.969 216.103 40.7257 216.81 9.47901C216.834 9.25194 216.797 9.02249 216.702 8.81482C216.607 8.60716 216.458 8.42896 216.27 8.299C216.033 8.18868 215.774 8.13318 215.513 8.13665C215.251 8.14011 214.994 8.20244 214.76 8.319ZM249.19 54.989C243.211 58.0628 236.886 60.4128 230.35 61.989C230.046 62.0417 229.767 62.1922 229.555 62.4178C229.344 62.6434 229.212 62.9317 229.18 63.239L228.61 91.799C228.49 98.149 226.8 100.039 217.61 104.149C217.05 104.399 216.61 104.779 216.61 105.289C216.606 105.524 216.675 105.754 216.808 105.947C216.94 106.141 217.13 106.288 217.35 106.369C230.28 110.419 250.62 105.369 250.75 88.839L251.25 55.839C251.261 55.6443 251.215 55.4506 251.117 55.2818C251.019 55.113 250.874 54.9765 250.7 54.889C250.459 54.7832 250.196 54.737 249.933 54.7544C249.67 54.7718 249.415 54.8523 249.19 54.989ZM230.14 14.169C229.94 24.729 229.83 29.999 229.62 40.559C229.609 40.7604 229.655 40.9609 229.752 41.1376C229.849 41.3143 229.994 41.4603 230.17 41.559C230.608 41.7134 231.088 41.6919 231.51 41.499C237.521 38.4634 243.877 36.1667 250.44 34.659C250.738 34.6206 251.014 34.4834 251.224 34.2694C251.434 34.0555 251.567 33.7772 251.6 33.479C251.75 23.279 251.83 18.179 251.98 7.97901C251.964 7.68797 251.842 7.41278 251.638 7.20484C251.434 6.99689 251.161 6.87041 250.87 6.849C244.1 5.599 236.38 2.429 231.15 0.138996C230.664 -0.0463322 230.126 -0.0463322 229.64 0.138996C225.92 2.009 222.31 4.439 218.75 6.239C218.581 6.34791 218.44 6.49533 218.34 6.66918C218.239 6.84302 218.181 7.03832 218.17 7.239C218.151 7.46554 218.19 7.6932 218.285 7.89994C218.38 8.10667 218.526 8.28546 218.71 8.41899C221.46 10.419 225.71 11.989 229.2 13.159C229.74 13.359 230.15 13.839 230.14 14.169Z"/>
          <path d="M283.04 4.29899C277.103 7.02841 270.862 9.04253 264.45 10.299C264.156 10.3255 263.88 10.4538 263.67 10.6619C263.46 10.87 263.329 11.1448 263.3 11.439L262.25 94.869C262.239 95.0189 262.262 95.1693 262.318 95.309C262.373 95.4487 262.459 95.5742 262.57 95.676C262.68 95.7779 262.812 95.8535 262.956 95.8973C263.1 95.9411 263.251 95.9519 263.4 95.929C269.4 96.059 277.04 99.109 282.31 100.879C282.817 101.044 283.367 101.023 283.86 100.819C284.048 100.733 284.205 100.59 284.309 100.411C284.413 100.232 284.459 100.025 284.44 99.819C284.673 68.279 284.897 36.739 285.11 5.199C285.124 4.99598 285.078 4.79339 284.978 4.61586C284.879 4.43832 284.73 4.2935 284.55 4.199C284.05 4.06105 283.518 4.09629 283.04 4.29899ZM287.51 45.079C287.293 45.1829 287.106 45.3419 286.969 45.5401C286.833 45.7383 286.75 45.969 286.73 46.209C286.73 46.689 287.13 46.999 287.68 47.209C296.68 49.809 298.37 51.539 298.35 57.599L298.22 93.479C298.22 93.6286 298.25 93.7768 298.309 93.9143C298.368 94.0518 298.455 94.1758 298.563 94.2788C298.672 94.3818 298.8 94.4615 298.941 94.5131C299.081 94.5647 299.231 94.5871 299.38 94.579C305.46 94.999 312.83 97.889 318.38 100.409C318.818 100.554 319.292 100.554 319.73 100.409C319.942 100.35 320.13 100.227 320.27 100.057C320.41 99.8872 320.493 99.6783 320.51 99.459L320.41 58.459C320.64 41.429 299.14 39.739 287.51 45.079ZM318.18 2.99899C312.268 5.71045 306.05 7.69494 299.66 8.90899C299.369 8.92899 299.095 9.05155 298.886 9.25483C298.678 9.45812 298.548 9.72892 298.52 10.019C298.48 20.0723 298.443 30.119 298.41 40.159C298.39 40.3641 298.435 40.5702 298.537 40.7492C298.639 40.9282 298.794 41.0713 298.98 41.159C299.212 41.2963 299.476 41.3687 299.745 41.3687C300.014 41.3687 300.278 41.2963 300.51 41.159C305.83 38.339 312.69 36.599 319.2 35.399C319.491 35.379 319.765 35.2564 319.974 35.0532C320.182 34.8499 320.312 34.5791 320.34 34.289C320.34 24.2023 320.313 14.109 320.26 4.009C320.253 3.78551 320.177 3.56969 320.043 3.3908C319.908 3.21192 319.722 3.07863 319.51 3.009C319.078 2.87046 318.614 2.86696 318.18 2.99899Z" />
          <path d="M418.61 17.079C418.614 16.8661 418.56 16.6561 418.455 16.4713C418.349 16.2864 418.195 16.1336 418.01 16.029C412.404 12.5798 407.548 8.04007 403.73 2.679C403.572 2.42542 403.342 2.22502 403.07 2.10377C402.797 1.98252 402.494 1.94601 402.2 1.99899C393.05 4.81899 388.47 6.179 379.29 8.869C372.51 10.789 369.69 10.039 364.09 3.70899C363.893 3.51325 363.653 3.36682 363.389 3.28166C363.125 3.1965 362.844 3.17503 362.57 3.21899C362.152 3.43288 361.823 3.78687 361.64 4.21899C358.17 15.219 373.28 30.449 387.91 25.089L395.07 23.089C395.295 23.0251 395.532 23.0108 395.763 23.047C395.994 23.0833 396.215 23.1692 396.41 23.299C396.582 23.4047 396.725 23.5514 396.826 23.7259C396.927 23.9004 396.984 24.0973 396.99 24.299C397.517 49.8657 398.04 75.4356 398.56 101.009C398.546 101.226 398.596 101.443 398.702 101.632C398.809 101.822 398.968 101.977 399.16 102.079C399.384 102.228 399.64 102.322 399.908 102.355C400.175 102.388 400.446 102.359 400.7 102.269C405.9 100.119 413.31 98.149 419.39 98.449C419.536 98.4684 419.685 98.4553 419.825 98.4106C419.966 98.3658 420.094 98.2906 420.202 98.1903C420.31 98.0899 420.395 97.967 420.45 97.8302C420.505 97.6934 420.529 97.5461 420.52 97.399C419.88 70.6257 419.243 43.8523 418.61 17.079ZM395.7 101.849C386.39 97.769 384.82 96.219 384.7 89.929L384.1 56.529C384.089 56.3272 384.03 56.131 383.927 55.957C383.824 55.7829 383.681 55.6362 383.51 55.529C383.278 55.4005 383.019 55.3265 382.754 55.3127C382.489 55.2988 382.224 55.3454 381.98 55.449C376.81 57.909 369.3 60.319 363.33 60.569C363.182 60.5577 363.033 60.5777 362.893 60.6278C362.752 60.6779 362.624 60.757 362.517 60.8598C362.409 60.9626 362.325 61.0869 362.268 61.2246C362.212 61.3623 362.185 61.5103 362.19 61.659C362.32 71.849 362.39 76.939 362.52 87.129C363.25 103.849 383.1 107.199 395.93 104.239C396.163 104.178 396.365 104.035 396.501 103.837C396.637 103.639 396.697 103.398 396.67 103.159C396.649 102.871 396.547 102.595 396.375 102.363C396.204 102.131 395.969 101.953 395.7 101.849Z" />
          <path d="M455.14 5.109C454.918 5.2405 454.735 5.42799 454.609 5.65265C454.482 5.87732 454.417 6.13124 454.42 6.389C454.445 6.65702 454.556 6.90984 454.736 7.10984C454.916 7.30983 455.156 7.44632 455.42 7.499C464.42 10.789 466.14 12.899 466.33 20.019C466.79 36.8923 467.247 53.7624 467.7 70.629C467.715 70.9022 467.632 71.1716 467.464 71.3883C467.297 71.6049 467.058 71.7542 466.79 71.809C463.235 72.3972 459.721 73.2122 456.27 74.249C455.793 74.2899 455.318 74.1586 454.93 73.879C454.75 73.7404 454.603 73.5635 454.499 73.3613C454.395 73.159 454.337 72.9362 454.33 72.709C453.757 51.1957 453.183 29.689 452.61 8.189C452.608 7.97046 452.552 7.75578 452.448 7.56392C452.343 7.37206 452.193 7.20895 452.01 7.08901C451.78 6.95841 451.52 6.88974 451.255 6.88974C450.99 6.88974 450.73 6.95841 450.5 7.08901C445.24 10.199 438.24 12.209 432.16 13.399C431.86 13.4327 431.583 13.5738 431.378 13.7962C431.174 14.0186 431.058 14.3073 431.05 14.609C431.803 44.069 432.547 73.5323 433.28 102.999C433.316 103.326 433.447 103.636 433.656 103.89C433.866 104.144 434.145 104.332 434.46 104.429C440.84 106.809 447.97 110.079 453.36 114.329C453.56 114.523 453.802 114.669 454.067 114.755C454.332 114.842 454.614 114.867 454.89 114.829C455.43 114.639 455.44 114.209 455.43 113.669C455.16 103.729 455.03 98.759 454.76 88.809C454.759 88.5434 454.85 88.2857 455.018 88.0797C455.186 87.8737 455.42 87.7321 455.68 87.679C458.93 86.979 463 86.289 466.21 85.519C466.45 85.4925 466.692 85.5152 466.922 85.5857C467.153 85.6562 467.366 85.7731 467.55 85.929C467.867 86.1747 468.078 86.5325 468.14 86.929C468.39 95.999 468.51 100.539 468.76 109.609C468.79 109.952 468.916 110.28 469.123 110.556C469.33 110.831 469.609 111.044 469.93 111.169C476.656 114.08 482.965 117.874 488.69 122.449C489.05 122.739 489.69 123.099 490.02 122.979C490.259 122.901 490.463 122.741 490.595 122.526C490.727 122.312 490.778 122.058 490.74 121.809C489.847 88.569 488.96 55.329 488.08 22.089C488.16 4.24901 469.22 -2.321 455.14 5.109Z"/>
          <path d="M517.71 10.229C512.15 13.859 505 17.029 499.43 17.439C499.267 17.4511 499.107 17.4966 498.962 17.5726C498.817 17.6487 498.689 17.7536 498.586 17.8811C498.483 18.0085 498.407 18.1557 498.363 18.3136C498.319 18.4714 498.308 18.6366 498.33 18.799L500.82 114.369C500.843 114.729 500.963 115.076 501.167 115.374C501.371 115.671 501.652 115.908 501.98 116.059C508.25 119.169 515.29 123.369 520.57 128.569C520.734 128.797 520.969 128.965 521.239 129.046C521.508 129.128 521.797 129.118 522.06 129.019C522.39 128.899 522.61 128.559 522.59 127.929C521.67 89.1957 520.747 50.469 519.82 11.749C519.834 11.472 519.787 11.1954 519.683 10.9382C519.58 10.681 519.422 10.4493 519.22 10.259C518.996 10.1147 518.736 10.0354 518.469 10.0302C518.203 10.0249 517.94 10.0937 517.71 10.229ZM553.98 76.559C548.64 79.389 541.89 80.699 535.84 81.009C535.682 81.0188 535.527 81.0608 535.385 81.1323C535.244 81.2038 535.118 81.3034 535.016 81.425C534.914 81.5466 534.838 81.6877 534.792 81.8397C534.746 81.9916 534.732 82.1513 534.75 82.309L535.56 119.459C535.74 127.709 534.03 129.579 525.44 130.459C525.312 130.457 525.185 130.482 525.068 130.533C524.95 130.583 524.845 130.658 524.759 130.753C524.673 130.848 524.608 130.96 524.568 131.081C524.529 131.203 524.516 131.332 524.53 131.459C524.582 132.106 524.858 132.714 525.31 133.179C536.47 143.279 559.31 147.539 556.89 124.639C556.61 109.212 556.333 93.7823 556.06 78.349C556.066 78.0739 556.016 77.8004 555.915 77.5446C555.814 77.2888 555.662 77.0557 555.47 76.859C555.289 76.6522 555.045 76.5108 554.776 76.4565C554.506 76.4023 554.227 76.4383 553.98 76.559ZM533.35 18.429L534.1 52.759C534.099 53.0156 534.151 53.2697 534.253 53.5054C534.354 53.7411 534.503 53.9534 534.69 54.129C534.875 54.2689 535.092 54.3588 535.321 54.3904C535.551 54.4219 535.785 54.3939 536 54.309C541.811 51.4518 548.011 49.4639 554.4 48.409C554.73 48.3394 555.023 48.1515 555.224 47.8807C555.425 47.6098 555.519 47.2749 555.49 46.939C555.283 35.019 555.07 23.1023 554.85 11.189C554.854 10.8296 554.744 10.4782 554.535 10.1853C554.327 9.89242 554.031 9.67317 553.69 9.55901C546.98 7.61901 539.12 3.179 533.69 0.179001C533.455 0.0626729 533.197 0.00215149 532.935 0.00215149C532.673 0.00215149 532.415 0.0626729 532.18 0.179001C528.54 2.609 525.06 5.629 521.6 7.789C521.425 7.94531 521.287 8.13846 521.195 8.35458C521.103 8.57071 521.061 8.80444 521.07 9.039C521.062 9.31534 521.111 9.59042 521.214 9.84688C521.317 10.1033 521.472 10.3356 521.67 10.529C524.46 12.999 528.86 15.339 532.37 17.089C532.626 17.2212 532.848 17.4111 533.018 17.6436C533.188 17.8761 533.302 18.145 533.35 18.429Z"/>
          <path d="M585.66 6.649C580.135 10.5891 573.916 13.4525 567.33 15.089C566.991 15.1925 566.697 15.4083 566.497 15.701C566.297 15.9936 566.203 16.3456 566.23 16.699L568.12 138.159C568.11 138.57 568.209 138.977 568.408 139.337C568.606 139.697 568.897 139.998 569.25 140.209C575.25 143.149 581.93 150.749 587.25 156.209C587.426 156.421 587.651 156.588 587.905 156.696C588.159 156.804 588.435 156.85 588.71 156.829C589.03 156.779 589.24 156.319 589.24 155.569C588.733 106.429 588.227 57.289 587.72 8.149C587.72 7.649 587.51 6.83899 587.14 6.63899C586.912 6.51799 586.657 6.45556 586.399 6.45731C586.14 6.45905 585.887 6.52493 585.66 6.649ZM590.99 70.789C590.744 70.9757 590.549 71.2207 590.422 71.5017C590.294 71.7828 590.239 72.0911 590.26 72.399C590.267 72.7359 590.357 73.066 590.521 73.3605C590.684 73.655 590.918 73.9051 591.2 74.089C600.06 80.189 601.61 83.419 601.68 93.239C601.807 112.619 601.933 131.999 602.06 151.379C602.042 151.819 602.133 152.256 602.325 152.652C602.517 153.048 602.804 153.391 603.16 153.649C609.04 156.949 615.58 164.649 620.8 171.489C620.946 171.681 621.136 171.836 621.353 171.942C621.57 172.048 621.809 172.102 622.05 172.099C622.52 172.029 622.77 171.349 622.77 170.809V100.439C623.17 83.159 611.25 61.349 590.99 70.789ZM620.69 5.119C615.23 9.41419 608.978 12.5914 602.29 14.469C601.937 14.6005 601.637 14.8436 601.435 15.1612C601.233 15.4788 601.14 15.8537 601.17 16.229L601.49 65.069C601.458 65.6722 601.662 66.2642 602.06 66.719C602.62 67.269 602.99 67.369 603.54 66.989C608.54 63.479 615.44 61.579 621.66 60.549C622.017 60.4336 622.322 60.198 622.525 59.8826C622.727 59.5671 622.814 59.1912 622.77 58.819V6.819C622.774 6.50484 622.707 6.19383 622.576 5.90846C622.444 5.6231 622.251 5.37052 622.01 5.16899C621.815 5.04348 621.589 4.97265 621.357 4.96385C621.125 4.95506 620.894 5.00864 620.69 5.119Z"/>
        </svg>

        <div className="bj-card-pile"><CardPile ref={this.cardPile} cards={this.pile}/></div>
        <div className="dealer-hand"><BlackJackHand  ref={this.dealerHand} showTotalValue={true} dealerHand={true}/></div>
        <div className="player-hand">
          <BlackJackHand  ref={this.playerHand} showTotalValue={true}/>
          <div className="player-menu">
            <div ref={this.hitButton} className="hit-button" icon='+' label='Tirer'></div>
            <div ref={this.standButton} className="stand-button" icon="-" label='Refuser'></div>
          </div>
        </div>
        {endModal}
      </div>
    )
  }
}

export default BlackJackApp;
