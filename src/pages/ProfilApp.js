import React from 'react';
import { withRouter } from '../scripts/router_hoc';
import { getSession, validateToken, logout } from '../_actions/session';
import { getGameHistory, changeUserName } from '../_actions/api_actions';

import Button from '../components/Button';

import './css/ProfilApp.css';

class ProfilApp extends React.Component {

  constructor() {
    super();

    this.newUsername = React.createRef();

    this.state = {};
  }

  async componentDidMount() {
    let session = await getSession();
    
    this.checkAccess();

    getGameHistory().then((list) => { 
      this.setState(() => ({
        gameList : list
      }));
    });

    this.setState(() => ({
      username : session.name
    }));
  }

  async checkAccess() {

    let canAccess = await validateToken();

    this.setState(() => ({
      canAccess : canAccess
    }), () => {
      if(!this.state.canAccess) this.props.navigate("/");
    });
  }

  async changeUserNameAndReload() {
    let username = this.newUsername.current.value;

    console.log(username);

    await changeUserName(username);
    window.location.reload();
  }

  logoutAndReload() {
    logout();
    window.location.reload();
  }

  render() {

    let gameTable = [];

    if(this.state.gameList) {
      for(let game of this.state.gameList) {
        gameTable.push(<div>{game.gameType}</div>);
        gameTable.push(<div>{game.victory ? "Victoire" : "Défaite"}</div>);
      }
    }

    if(gameTable.length < 10) {
      let startingLength = gameTable.length;
      for(let i = 0; i < (10 - startingLength)/2; i++) {
        gameTable.push(<div></div>);
        gameTable.push(<div></div>);
      }
    }

    return (
      <div className="ProfilApp">
        <div id="profil-page">
          <div className="profil-header">
            <div>Profil // connecté en tant que {this.state.username}.</div>
            <Button label="Se déconnecter" action={() => this.logoutAndReload() }/>
          </div>
          <div className="profil-separator"></div>
          <div className="profil-header">
            <div className="form-input input-profil">
              <input type="text" ref={this.newUsername} required/>
              <div className="placeholder">Nom d'utilisateur</div> 
            </div>
            <Button label="Changer de nom d'utilisateur" action={() => this.changeUserNameAndReload() }/>
          </div>
          <div className="profil-separator"></div>
          <div>Historique des parties</div>
          <div className="history-grid">
            <div className="grid-header">Nom du jeu</div>
            <div className="grid-header">Résultat</div>
            {gameTable}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProfilApp);
