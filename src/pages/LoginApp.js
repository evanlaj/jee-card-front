import React from 'react';

import Button from '../components/Button';
import { authenticate, hello } from '../_actions/api_actions';

import './css/LoginApp.css';

class LoginApp extends React.Component {

  constructor() {
    super();
    this.mailInput = React.createRef();
    this.pwInput = React.createRef();
  }
  
  async login() {
    
    let mail = this.mailInput.current.value;
    let pw   = this.pwInput.current.value;
    
    let data = await authenticate(mail, pw);

    console.log(data);
  }

  async hello() {
    let data = await hello();

    console.log(data);
  }


  render() {
    return (
      <div className="LoginApp">
        <div id="login-page">
          <div id="form-title">Connexion</div>
          <div class="form-input">
            <input type="text" ref={this.mailInput} required/>
            <div class="placeholder">Adresse mail</div> 
          </div>
          <div class="form-input">
            <input type="password" ref={this.pwInput} required/>
            <div class="placeholder">Mot de passe</div>
          </div>
          <div class="login-button">
            <Button label="Se connecter" action={() => this.login()}/>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginApp;
