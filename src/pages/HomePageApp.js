import { NavLink } from 'react-router-dom';
import React from 'react';

import { getSession, logout } from '../_actions/session'

import Button from '../components/Button';

import './css/HomePageApp.css';

class HomePageApp extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  async componentDidMount() {
    let session = await getSession();

    if(session.isLoggedIn()) {
      this.setState(() => ({
        username : session.name
      }));
    }
  }

  logoutAndReload() {
    logout();
    window.location.reload();
  }

  render() {
    if(this.state.username) {
      return (
        <div className="HomePageApp">
          <div id="home-page">
            <div>Bienvenue, vous êtes connecté en tant que {this.state.username}.</div>
            <div className="home-page-buttons">
              <Button label="Se déconnecter" action={() => this.logoutAndReload() }/>
            </div>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="HomePageApp">
          <div id="home-page">
            <div>Bienvenue, pour accéder aux jeux, veuillez vous authentifier :</div>
            <div className="home-page-buttons">
              <NavLink to="/register"><Button label="S'enregistrer"/></NavLink>
              <NavLink to="/login"><Button label="Se connecter"/></NavLink>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default HomePageApp;
