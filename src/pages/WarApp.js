import React from 'react';
import { getShuffle, getFullDeck } from '../scripts/cards-util';
import { delay } from '../scripts/anim-util';
import { withRouter } from '../scripts/router_hoc';

import { checkAvailability } from '../_actions/api_actions';

import WarBoard from '../components/WarBoard';
import CardPile from '../components/CardPile';
import EndModal from '../components/EndModal';
import PopUp    from '../components/PopUp';

import './css/WarApp.css';

class WarApp extends React.Component {

  constructor() {
    super();

    this.playerPile = React.createRef();
    this.playerBoard = React.createRef();
    
    this.opponentPile = React.createRef();
    this.opponentBoard = React.createRef();

    this.playButton = React.createRef();

    this.popupLabel = "";
    this.endModalInfo = {title: "", info: "", show: false};
  }

  componentDidMount() {
    this.checkAccess();
    this.playButton.current.addEventListener('click', () => this.playTurn());
    this.startGame();
  }

  async checkAccess() {

    let canAccess = localStorage.getItem('access_token');

    canAccess = canAccess && (await checkAvailability("War"));

    this.setState(() => ({
      canAccess : canAccess
    }), () => {
      if(!this.state.canAccess) this.props.navigate("/");
    });

    if(!localStorage.getItem('access_token')) this.props.navigate("/");
  }

  async startGame() {

    //reset last game
    this.endModalInfo.show = false;
    this.forceUpdate();
    
    this.playerCanPlay = false;

    //prepare card piles
    this.initPiles();

    this.playerCanPlay = true;
  }

  initPiles() {
    let pile = getShuffle(getFullDeck());

    //Custom pile for testing purpose
    /*pile = getShuffle([
      { color:"♦", value:"1" },
      { color:"♦", value:"2" },
      { color:"♦", value:"1" },
      { color:"♦", value:"2" },
      { color:"♦", value:"1" },
      { color:"♦", value:"2" },
      { color:"♦", value:"1" },
      { color:"♦", value:"2" }
    ]):*/

    let playerPile = pile.slice(0, pile.length/2);
    let opponentPile = pile.slice(pile.length/2, pile.length);

    this.playerPile.current.emptyPile();
    this.playerPile.current.pushCards(playerPile);

    this.opponentPile.current.emptyPile();
    this.opponentPile.current.pushCards(opponentPile);
  }

  async playTurn() {

    if(!this.playerCanPlay) return;

    //prevent spamming
    this.playerCanPlay = false;

    
    await this.drawPlayer(true);
    await this.drawOpponent(true);

    while (this.playerBoard.current.getValue() == this.opponentBoard.current.getValue()) {
      this.showPopUp("Bataille !");
      await delay(1000);

      await this.drawPlayer(false);
      await this.drawOpponent(false);

      await this.drawPlayer(true);
      await this.drawOpponent(true);
    }

    let points = this.playerBoard.current.getValue() - this.opponentBoard.current.getValue();

    if(points > 0) {
      this.showPopUp("Victoire !");
      await delay(200);
      await this.opponentBoard.current.reveal();
      await delay(1000);

      this.playerPile.current.pushCards(this.playerBoard.current.emptyBoard());
      this.playerPile.current.pushCards(this.opponentBoard.current.emptyBoard());
    }
    else {
      this.showPopUp("Défaite !");
      await delay(200);
      await this.playerBoard.current.reveal();
      await delay(1000);

      this.opponentPile.current.pushCards(this.opponentBoard.current.emptyBoard());
      this.opponentPile.current.pushCards(this.playerBoard.current.emptyBoard());
    }

    this.playerCanPlay = true;
    if (this.opponentPile.current.getNbCard() == 0 || this.playerPile.current.getNbCard() == 0) this.showEndModal();
  }

  async drawPlayer(visible) {
    let card = this.playerPile.current.shiftCard();
    if(!card) {
      await this.playerBoard.current.revealLast();
      this.forceUpdate();
      await delay(100);
      return;
    }
    card.visible = visible;

    this.playerBoard.current.pushCard(card);
    this.forceUpdate();
    await delay(100);
  }

  async drawOpponent(visible) {
    let card = this.opponentPile.current.shiftCard();
    if(!card) {
      await this.opponentBoard.current.revealLast();
      this.forceUpdate();
      await delay(100);
      return;
    }
    card.visible = visible;

    this.opponentBoard.current.pushCard(card);
    this.forceUpdate();
    await delay(400);
  }

  async showPopUp(label) {
    this.popupLabel = label;
    this.forceUpdate();
    await delay(2000);
    this.popupLabel = "";
    this.forceUpdate();
  }

  async showEndModal() {

    this.playerCanPlay = false;

    let playerWon = (this.opponentPile.current.getNbCard() == 0);

    await delay(500);
    this.endModalInfo.info = "Vous avez " + (playerWon ? "gagné":"perdu") +".";
    this.endModalInfo.title = "Victoire";
    this.endModalInfo.show = true;

    this.forceUpdate();
  }

  quitGame() {
    this.props.navigate("/");
  }

  render() {

    let endModal = null;
    if(this.endModalInfo.show)
      endModal = (<EndModal actionReplay={() => this.startGame()} info={this.endModalInfo.info} actionQuit={() => this.quitGame()}/>);

    let warPopup = null;
    if(this.popupLabel != "")
      warPopup = <PopUp label={this.popupLabel} />;

    return (
      <div className="WarApp">
        <svg id="logo-war" width="504" height="175" viewBox="0 0 504 175">
          <path d="M20.4182 6.7065C20.4767 6.70826 20.5346 6.69598 20.5852 6.67107C20.6357 6.64617 20.6769 6.60966 20.7039 6.5658C20.7326 6.52369 20.7744 6.48897 20.8247 6.46537C20.8751 6.44176 20.932 6.43015 20.9896 6.43178C22.0053 6.43178 22.5132 7.10183 22.4894 8.54243C21.8069 60.8327 21.1298 113.134 20.4579 165.447C20.4579 166.867 20.0056 167.799 19.1723 168.241C18.8179 168.419 18.5798 168.453 18.4581 168.341C15.8476 167.191 12.9587 166.563 10.0148 166.505C6.92904 166.447 3.84966 166.768 0.873067 167.457C0.28584 167.397 -0.00777887 166.887 0.000156637 165.936C0.158867 117.215 0.333451 68.4935 0.523903 19.7724C0.523903 18.4323 0.849258 17.7622 1.4841 17.7622C4.90999 16.5985 8.1685 15.1104 11.1972 13.3265C14.5134 11.3727 17.601 9.15594 20.4182 6.7065ZM55.4614 63.9752C55.8265 64.0711 56.1383 64.2751 56.3395 64.5496C56.5407 64.8241 56.6177 65.1507 56.5565 65.4694C56.0592 85.3965 55.5619 105.324 55.0646 125.251C54.9535 132.501 53.2395 139.871 49.0416 146.23C45.2801 151.925 40.8521 156.033 35.8607 158.378C31.5993 160.388 27.338 161.058 23.0369 160.153C22.4338 160.1 22.1799 159.611 22.2434 158.693C22.2856 157.843 22.6407 157.025 23.2591 156.354C25.4493 154.083 27.2269 152.14 28.5759 150.491C29.7883 149.061 30.8152 147.524 31.639 145.908C32.3609 144.405 32.8464 142.828 33.0833 141.218C33.3872 139.164 33.5462 137.097 33.5594 135.027C33.8927 116.292 34.2286 97.5534 34.5672 78.81C34.5672 77.959 34.3371 77.4699 33.8451 77.4364C32.0293 76.6676 30.2721 75.8038 28.5838 74.85C26.9253 73.9053 25.2351 72.9136 23.5131 71.8616C23.2501 71.7003 23.044 71.4817 22.9168 71.2291C22.7896 70.9765 22.7461 70.6995 22.7909 70.4277C22.7753 69.7797 23.0601 69.1522 23.5845 68.6789C26.9862 65.0071 30.5968 61.2325 34.4164 57.3551C34.6704 56.9732 34.9243 56.7655 35.21 56.7253C35.3317 56.7253 35.5142 56.866 35.7575 57.1474C38.5748 59.0571 41.7048 60.6121 45.05 61.764C48.3797 62.9118 51.8849 63.6562 55.4614 63.9752ZM24.6002 7.98629C24.2773 7.79838 24.02 7.54068 23.8553 7.24013C23.6905 6.93957 23.6244 6.60717 23.6638 6.27767C23.6375 5.94235 23.7143 5.60699 23.8867 5.3041C24.0591 5.00121 24.3213 4.74108 24.6478 4.54896C29.2742 1.52036 33.7657 0.106567 38.0985 0.133368C43.328 0.166871 47.8433 2.25741 51.5889 6.21068C56.501 11.4638 56.493 18.5328 56.8501 24.8379C56.6835 31.4914 56.6041 34.8216 56.4375 41.4818C56.4483 41.845 56.3454 42.2041 56.1392 42.523C55.933 42.8418 55.6307 43.109 55.263 43.2976C51.8303 44.5365 48.5658 46.0843 45.5262 47.9142C42.2455 49.8962 39.2354 52.1794 36.5511 54.7219C36.4599 54.8295 36.3413 54.9185 36.2039 54.9823C36.0666 55.0461 35.914 55.083 35.7575 55.0904C34.8767 55.2244 34.4561 54.6951 34.472 53.4957C34.6466 43.9141 34.8185 34.3302 34.9878 24.7441C35.0525 22.7311 34.9624 20.7168 34.718 18.7137C34.5459 17.2538 34.0535 15.8336 33.2658 14.5259C32.4592 13.2799 31.3825 12.173 30.0916 11.2628C28.3593 10.0578 26.5239 8.96265 24.6002 7.98629Z" />
          <path d="M94.6152 3.91246C94.3659 4.10899 94.167 4.3465 94.0305 4.61038C93.894 4.87426 93.8229 5.15893 93.8216 5.44687C93.8003 5.71775 93.8768 5.98773 94.0412 6.22105C94.2056 6.45437 94.45 6.64003 94.7421 6.75346C103.622 10.3985 105.249 12.6029 104.979 20.6971C104.328 39.8782 103.683 59.0638 103.043 78.2539C103.034 78.578 102.939 78.8964 102.764 79.1852C102.59 79.4741 102.341 79.726 102.035 79.9223C98.2345 81.9119 94.6116 84.1334 91.195 86.5691C91.0029 86.6829 90.7769 86.7488 90.5426 86.7595C90.3083 86.7701 90.0752 86.7251 89.8697 86.6294C89.4968 86.4887 89.3301 85.8656 89.346 85.43C90.1819 59.5217 91.0151 33.5999 91.8457 7.66472C91.8457 7.22249 91.6711 6.51894 91.314 6.32463C91.1017 6.16861 90.8297 6.08267 90.5482 6.08267C90.2668 6.08267 89.9948 6.16861 89.7825 6.32463C84.3228 10.1774 76.9428 13.1993 70.8007 15.1223C70.4307 15.2734 70.121 15.5123 69.9096 15.8099C69.6981 16.1075 69.5941 16.4507 69.6104 16.7974C68.4994 55.8699 67.399 94.9224 66.3092 133.955C66.3092 134.658 66.6743 135.241 67.3885 135.181C73.5305 134.698 80.5931 134.859 85.6401 136.869C85.8953 136.965 86.1804 136.988 86.4524 136.935C86.7244 136.882 86.9686 136.755 87.1479 136.575C87.3838 136.335 87.5602 136.058 87.6665 135.76C87.7729 135.462 87.807 135.149 87.7668 134.839C88.0948 124.833 88.4149 114.829 88.727 104.828C88.7727 104.146 89.1314 103.507 89.7269 103.046C93.1868 100.667 97.3212 98.1006 100.559 95.9565C100.745 95.8331 100.97 95.759 101.206 95.7435C101.442 95.728 101.678 95.7718 101.884 95.8693C102.056 95.9799 102.194 96.1231 102.288 96.2872C102.381 96.4514 102.428 96.6319 102.424 96.8141C102.138 105.426 101.85 114.036 101.559 122.644C101.559 123.281 101.916 123.83 102.654 123.81C108.931 123.609 115.978 124.393 121.231 126.162C121.45 126.243 121.692 126.273 121.93 126.247C122.167 126.221 122.392 126.141 122.58 126.015C122.837 125.805 123.041 125.553 123.177 125.274C123.314 124.995 123.381 124.695 123.373 124.393L126.944 21.0321C128.008 5.10514 111.343 -5.52846 94.6152 3.91246Z" />
          <path d="M189.587 2.80018C189.552 2.56655 189.449 2.34395 189.287 2.15221C189.125 1.96047 188.909 1.80556 188.659 1.70131C188.294 1.5539 187.715 1.74151 187.302 2.24404C181.588 9.27281 178.454 10.2243 171.621 8.02653C163.94 5.45803 156.301 2.80019 148.704 0.0530062C148.14 -0.148007 147.331 0.247315 146.958 0.823553C143.244 6.57779 138.838 11.9935 133.809 16.985C133.401 17.3746 133.18 17.8788 133.19 18.3988C133.19 19.0019 133.547 19.1895 134.11 19.3704C143.633 22.4973 153.19 25.5035 162.781 28.3892C181.755 34.433 191.016 15.5645 189.587 2.80018ZM181.334 108.593C177.902 106.952 174.26 105.646 170.479 104.701C170.187 104.625 169.935 104.469 169.761 104.257C169.587 104.046 169.501 103.792 169.518 103.535L171.661 31.793C171.694 31.5843 171.661 31.3718 171.565 31.1775C171.469 30.9832 171.313 30.8141 171.113 30.6874C170.895 30.5491 170.636 30.4646 170.364 30.4433C170.092 30.422 169.819 30.4648 169.574 30.5668C162.861 33.9644 155.746 36.7624 148.347 38.9156C147.999 39.0269 147.699 39.2236 147.485 39.4805C147.272 39.7373 147.154 40.0424 147.148 40.3562L144.672 114.624C144.672 115.408 145.085 115.83 145.791 115.756C152.14 115.086 162.011 116.614 168.257 119.408C168.516 119.528 168.816 119.568 169.106 119.52C169.396 119.472 169.657 119.34 169.844 119.147C173.35 116.086 177.171 113.294 181.263 110.805C181.469 110.662 181.633 110.48 181.74 110.274C181.848 110.068 181.896 109.843 181.882 109.619C181.906 109.25 181.723 108.727 181.334 108.593Z" />
          <path d="M219.258 3.75171C219.018 3.89083 218.82 4.07658 218.682 4.29341C218.544 4.51025 218.469 4.75185 218.465 4.998C218.463 5.23809 218.553 5.47225 218.722 5.66548C218.891 5.85872 219.129 6.00065 219.401 6.07007C228.384 9.13217 230.074 11.0418 229.979 17.7757C229.767 33.7228 229.548 49.6699 229.32 65.6169C229.325 65.8868 229.232 66.1515 229.055 66.3762C228.878 66.601 228.625 66.7754 228.328 66.8766C224.541 68.0179 220.855 69.386 217.298 70.9706C217.074 71.0352 216.836 71.0579 216.6 71.0371C216.364 71.0162 216.137 70.9524 215.933 70.85C215.743 70.7289 215.592 70.5702 215.492 70.3878C215.393 70.2055 215.348 70.0052 215.362 69.8047C215.753 48.81 216.137 27.8018 216.512 6.78032C216.512 6.42519 216.322 5.84896 215.957 5.70825C215.731 5.57891 215.464 5.50977 215.191 5.50977C214.918 5.50977 214.651 5.57891 214.425 5.70825C208.966 8.80386 201.681 11.0686 195.475 12.4422C195.138 12.5172 194.84 12.6839 194.626 12.9164C194.413 13.1489 194.296 13.4344 194.293 13.7287C193.537 44.1934 192.78 74.6625 192.024 105.136C192.001 105.417 192.109 105.694 192.323 105.909C192.538 106.123 192.843 106.26 193.174 106.289C199.681 106.959 207.014 108.352 212.426 111.033C212.657 111.166 212.928 111.243 213.208 111.255C213.488 111.266 213.767 111.213 214.013 111.1C214.247 110.953 214.428 110.754 214.537 110.526C214.646 110.298 214.679 110.049 214.632 109.806L215.084 85.5172C215.101 85.2446 215.203 84.9806 215.38 84.7522C215.557 84.5238 215.803 84.3392 216.092 84.2173C219.568 82.8303 223.829 81.3495 227.202 80.0296C227.426 79.9573 227.668 79.9318 227.907 79.9551C228.146 79.9784 228.375 80.0499 228.574 80.1636C228.742 80.2631 228.881 80.393 228.981 80.5437C229.081 80.6944 229.14 80.8621 229.154 81.0346C229.053 88.1818 228.953 95.3289 228.852 102.476C228.845 102.762 228.96 103.04 229.176 103.26C229.391 103.48 229.693 103.627 230.027 103.675C236.829 104.782 243.376 106.802 249.421 109.659C249.623 109.774 249.854 109.851 250.095 109.882C250.337 109.913 250.584 109.899 250.818 109.84C251.072 109.716 251.281 109.536 251.421 109.318C251.561 109.1 251.627 108.854 251.611 108.607C251.791 78.6783 251.971 48.7497 252.151 18.821C252.698 3.00127 234.383 -3.10954 219.258 3.75171Z" />
          <path d="M317.452 99.9366C317.707 100.027 317.932 100.168 318.107 100.35C318.281 100.531 318.4 100.746 318.452 100.975C318.526 101.201 318.51 101.442 318.407 101.66C318.304 101.877 318.119 102.061 317.881 102.181C315.364 104.007 313.053 106.026 310.977 108.212C308.795 110.488 306.809 112.893 305.033 115.408C304.906 115.75 304.446 115.877 303.652 115.797L303.255 115.75C295.32 112.52 287.305 109.438 279.203 106.456C277.467 105.72 275.583 105.266 273.648 105.116C271.858 105.018 270.088 105.484 268.68 106.423C266.637 107.877 264.776 109.505 263.126 111.28C262.882 111.547 262.527 111.727 262.134 111.783C261.467 111.783 260.912 111.294 260.745 110.517C260.11 107.615 260.467 104.245 261.07 101.263C261.583 98.481 262.731 95.8094 264.451 93.397C266.035 91.2116 268.211 89.3746 270.799 88.0366C273.433 86.6907 276.499 86.0745 279.568 86.2744C282.36 86.4295 285.097 86.9988 287.654 87.9562C297.717 91.6548 307.596 95.7622 317.452 99.9366ZM261.57 17.8428C261.331 17.7969 261.116 17.6852 260.959 17.5252C260.803 17.3651 260.713 17.1658 260.705 16.9583C260.672 16.7353 260.697 16.5088 260.781 16.2954C260.865 16.082 261.004 15.8872 261.189 15.7254C266.51 11.7137 270.878 6.88391 274.061 1.49368C274.255 1.31929 274.492 1.18236 274.755 1.09217C275.018 1.00199 275.301 0.960671 275.584 0.971047C283.414 3.43681 291.225 5.93831 299.018 8.47554C300.72 9.12434 302.544 9.51448 304.406 9.62802C306.102 9.64254 307.741 9.11335 308.993 8.14723C310.962 6.59274 312.736 4.87051 314.286 3.00799C314.42 2.85525 314.592 2.72844 314.789 2.63602C314.986 2.54359 315.204 2.48766 315.429 2.47195C316.063 2.47195 316.611 2.96108 316.786 3.76513C317.46 6.78703 317.143 10.2847 316.547 13.387C316.055 16.2478 314.956 19.0102 313.302 21.5414C311.845 23.76 309.793 25.66 307.311 27.0894C304.737 28.4891 301.699 29.1539 298.645 28.9856C295.921 28.8791 293.237 28.3829 290.709 27.5182C281.044 24.2015 271.323 20.9987 261.57 17.8428ZM299.661 30.0979C299.772 30.0247 299.9 29.9725 300.037 29.9447C300.174 29.917 300.316 29.9144 300.454 29.9371C301.359 29.9371 301.811 30.4061 301.827 31.2771C301.996 47.0947 302.166 62.9122 302.335 78.7297C302.335 79.5739 301.954 79.9626 301.168 79.9023C299.47 80.1368 297.645 80.3914 295.685 80.6795C293.725 80.9676 291.717 81.3093 289.702 81.7248C287.686 82.1402 285.734 82.6226 283.814 83.1721C282.01 83.6923 280.268 84.3517 278.608 85.142C278.555 85.1356 278.502 85.1389 278.451 85.1516C278.401 85.1643 278.354 85.1862 278.314 85.2157C278.274 85.2462 278.225 85.2686 278.173 85.2813C278.121 85.2941 278.066 85.2969 278.013 85.2894C277.815 85.2974 277.617 85.2681 277.435 85.2037C277.252 85.1392 277.089 85.0411 276.956 84.9166C276.824 84.7922 276.726 84.6444 276.67 84.484C276.614 84.3236 276.601 84.1547 276.632 83.9895L276.513 37.1802C276.482 36.9142 276.557 36.6471 276.725 36.4205C276.893 36.1939 277.145 36.0205 277.441 35.9273L282.956 34.9021C284.956 34.5336 286.924 34.1114 288.948 33.6357C290.971 33.16 292.876 32.6105 294.741 32.0075C296.434 31.4744 298.079 30.8361 299.661 30.0979Z" />
          <path d="M352.892 95.5276L351.154 95.8157C350.904 95.855 350.645 95.8372 350.405 95.7642C350.165 95.6912 349.953 95.5656 349.789 95.4003C349.441 95.1214 349.224 94.7453 349.178 94.3416C348.649 68.8799 348.104 43.3959 347.544 17.8895C347.573 17.6518 347.674 17.4243 347.836 17.2285C347.999 17.0327 348.217 16.8751 348.472 16.7706C351.948 15.4774 356.408 13.5745 359.09 11.4705C359.288 11.2923 359.439 11.0808 359.533 10.8498C359.627 10.6189 359.663 10.3738 359.637 10.1304C359.63 9.68327 359.413 9.25674 359.034 8.94445C355.392 6.80031 351.773 3.99952 347.924 1.80848C347.688 1.70399 347.425 1.64941 347.159 1.64941C346.892 1.64941 346.629 1.70399 346.393 1.80848C341.06 4.38815 333.22 7.94609 326.427 9.27277C326.094 9.34471 325.8 9.51111 325.595 9.74409C325.39 9.97707 325.286 10.2625 325.3 10.5526C325.829 40.2713 326.337 69.9765 326.824 99.6684C326.838 99.8634 326.9 100.054 327.005 100.228C327.11 100.402 327.257 100.556 327.435 100.68C333.109 104.667 338.815 111.736 342.227 117.606C342.347 117.874 342.566 118.103 342.852 118.259C343.137 118.414 343.475 118.488 343.814 118.47C351.059 117.425 354.67 116.942 361.851 116.011C368.811 115.18 371.652 116.52 377.532 125.874C377.952 126.544 378.587 126.973 379.119 126.886C379.363 126.814 379.579 126.687 379.744 126.52C379.909 126.352 380.016 126.15 380.055 125.934C382.484 114.034 373.27 91.7954 352.892 95.5276Z" />
          <path d="M413.757 109.022L412.059 109.203C411.686 109.317 411.131 109.056 410.726 108.62C410.382 108.268 410.172 107.836 410.123 107.381C409.446 78.4706 408.774 49.5559 408.107 20.6368C408.126 20.3799 408.22 20.131 408.38 19.9123C408.541 19.6936 408.764 19.512 409.028 19.3838C412.48 17.97 416.963 15.7991 419.59 13.474C420.001 13.0368 420.194 12.4818 420.13 11.9262C420.121 11.4336 419.908 10.9592 419.526 10.5862C415.868 8.08689 412.289 4.89747 408.417 2.3915C408.185 2.276 407.92 2.21509 407.651 2.21509C407.382 2.21509 407.117 2.276 406.885 2.3915C402.037 5.07168 393.435 9.40687 386.991 10.68C386.641 10.7712 386.339 10.9618 386.137 11.2195C385.934 11.4772 385.843 11.786 385.88 12.0938L388.308 111.455C388.343 111.893 388.556 112.307 388.911 112.627C394.855 118.034 399.926 125.794 403.497 133.05C403.87 133.801 404.473 134.209 405.084 134.183C412.123 133.754 415.622 133.553 422.598 133.144C431.692 132.635 434.882 140.34 437.794 145.875C438.207 146.665 438.818 147.215 439.302 147.181C439.553 147.103 439.772 146.966 439.932 146.785C440.092 146.604 440.188 146.388 440.206 146.163C442.563 133.432 435.485 107.327 413.757 109.022Z" />
          <path d="M501.715 95.0922C496.382 98.2615 488.819 100.453 483.701 99.6686C483.058 99.5681 482.598 100.124 482.606 101.19C482.685 115.998 482.767 130.806 482.852 145.614C482.907 155.718 481.066 157.828 472.806 158.063C472.29 158.063 471.901 158.391 471.909 159.162C471.934 159.923 472.191 160.666 472.655 161.319C476.765 166.17 485.114 175.337 493.343 174.412C503.468 173.28 503.079 160.066 503.54 153.956C503.603 135.109 503.664 116.263 503.722 97.4172C503.78 96.7179 503.522 96.026 503 95.4808C502.627 95.0922 502.08 94.9046 501.715 95.0922ZM470.512 13.5076C473.833 16.4695 477.414 19.2155 481.225 21.7223C481.783 22.1583 482.123 22.7572 482.177 23.3974L482.415 68.4378C482.393 69.0477 482.592 69.6487 482.987 70.1598C483.471 70.5485 483.939 70.6356 484.288 70.4479C489.913 67.4099 496.164 65.2894 502.714 64.1964C503.437 64.0892 503.833 63.2852 503.833 62.4342L504 14.8611C504 14.0101 503.603 13.0855 502.865 12.8509C496.136 10.3919 487.788 4.41508 482.82 1.00456C482.596 0.870711 482.329 0.798828 482.054 0.798828C481.78 0.798828 481.512 0.870711 481.289 1.00456C477.495 3.99295 474.043 7.57769 470.472 10.1842C470.091 10.6242 469.895 11.1599 469.917 11.7052C469.909 12.3415 470.115 12.9667 470.512 13.5076ZM480.495 87.5743C480.767 87.3695 480.976 87.1117 481.103 86.8232C481.23 86.5348 481.272 86.2245 481.225 85.9193C481.264 85.3037 481.063 84.6943 480.654 84.1839C477.72 80.4249 474.187 77.0249 470.155 74.0796C469.544 73.5373 469.204 72.8178 469.203 72.0695C469.007 53.0357 468.814 33.9953 468.624 14.9482C468.673 14.3833 468.463 13.824 468.036 13.387C467.457 12.9179 467.076 12.6231 466.505 13.0654C461.283 17.1593 453.371 21.1059 447.959 21.4543C447.317 21.5012 446.833 22.1243 446.848 23.0691C447.467 60.8283 448.092 98.5876 448.721 136.347C448.729 136.748 448.834 137.144 449.031 137.509C449.227 137.875 449.511 138.202 449.864 138.471C456.86 143.279 462.99 148.922 468.06 155.222C468.624 155.932 469.012 156.086 469.52 155.892C469.822 155.785 470.06 155.389 470.052 154.619C469.898 140.325 469.75 126.01 469.607 111.676C470.401 102.778 471.536 93.6248 480.495 87.5743Z" />
        </svg>

        <div className="opponent-card-pile"><CardPile ref={this.opponentPile} cards={[]}/></div>
        <div className="opponent-board"><WarBoard ref={this.opponentBoard}/></div>

        <div className="player-card-pile">
          <CardPile ref={this.playerPile} cards={[]}/>
          <div className="player-menu">
            <div ref={this.playButton} className="play-button" label='Jouer'></div>
          </div>
        </div>
        <div className="player-board"><WarBoard ref={this.playerBoard}/></div>
        <div className="war-popup">{warPopup}</div>
        {endModal}
      </div>
    )
  }
}

export default withRouter(WarApp);
