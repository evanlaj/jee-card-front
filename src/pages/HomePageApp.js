import React from 'react';

import Button from '../components/Button';

import './css/HomePageApp.css';

class HomePageApp extends React.Component {

  //constructor() {}

  //componentDidMount() {}

  render() {
    return (
      <div className="HomePageApp">
        <div id="home-page">
          <div>Bienvenue, pour accéder aux jeux, veuillez vous authentifier :</div>
          <div class="home-page-buttons">
            <Button label="S'enregistrer"/>
            <Button label="Se connecter"/>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePageApp;