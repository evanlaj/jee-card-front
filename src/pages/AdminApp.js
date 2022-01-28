import React from 'react';
import { withRouter } from '../scripts/router_hoc';
import { getSession } from '../_actions/session';
import { getUserList, getGameList, setGameAvailability, deleteUser } from '../_actions/api_actions';

import Button from '../components/Button';

import './css/AdminApp.css';

class AdminApp extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  async componentDidMount() {
    this.checkAccess();

    let session = await getSession();

    getUserList().then((list) => { 
      this.setState(() => ({
        userList : list
      }));
    });

    getGameList().then((list) => {
      this.setState(() => ({
        gameList : list
      }));
    })

    this.setState(() => ({
      username : session.name
    }));
  }

  async deleteUserAndRefresh(mail) {
    await deleteUser(mail);

    getUserList().then((list) => { 
      this.setState(() => ({
        userList : list
      }));
    });
  }

  async setGameAvailabilityAndRefresh(id, available) {
    await setGameAvailability(id, available);

    getGameList().then((list) => {
      this.setState(() => ({
        gameList : list
      }));
    })
  }

  async checkAccess() {

    let session = await getSession();
    let canAccess = localStorage.getItem('access_token') && (session.role === "ROLE_ADMIN");

    this.setState(() => ({
      canAccess : canAccess
    }), () => {
      if(!this.state.canAccess) this.props.navigate("/");
    });
  }

  render() {

    let userTable = [];

    if(this.state.userList) {
      for(let user of this.state.userList) {
        userTable.push(<div>{user.mail}</div>);
        userTable.push(<div>{user.username}</div>);
        userTable.push(<div>{user.role}</div>);
        userTable.push(<div><Button label="Bannir" action={() => this.deleteUserAndRefresh(user.mail)}/></div>);
      }
    }

    let gameTable = [];

    if(this.state.gameList) {
      for(let game of this.state.gameList) {
        gameTable.push(<div>{game.name}</div>);
        gameTable.push(<div>{game.available ? "OUI": "NON"}</div>);
        gameTable.push(<div><Button label="Changer" action={() => this.setGameAvailabilityAndRefresh(game.id, !game.available)}/></div>);
      }
    }

    return (
      <div className="AdminApp">
        <div id="admin-page">
          <div>Page d'administration // connecté en tant que {this.state.username}.</div>
          <div className="game-grid">
            <div className="grid-header">Nom</div>
            <div className="grid-header">Activé</div>
            <div className="grid-header">Activer</div>
            {gameTable}
          </div>
          <div className="user-grid">
            <div className="grid-header">Adresse mail</div>
            <div className="grid-header">Nom</div>
            <div className="grid-header">Rôle</div>
            <div className="grid-header">Bannir</div>
            {userTable}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(AdminApp);
