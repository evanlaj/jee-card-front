import React from 'react';

import Button from '../components/Button';

import './css/LoginApp.css';

class RegisterApp extends React.Component {

  render() {
    return (
      <div className="LoginApp">
        <div id="login-page">
          <div id="form-title">Inscription</div>
          <div class="form-input">
            <input type="text" required/>
            <div class="placeholder">Adresse mail</div> 
          </div>
          <div class="form-input">
            <input type="text" required/>
            <div class="placeholder">Pseudo</div>
          </div>
          <div class="form-input">
            <input type="text" required/>
            <div class="placeholder">Mot de passe</div>
          </div>
          <div class="login-button">
            <Button label="S'inscrire'"/>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterApp;
