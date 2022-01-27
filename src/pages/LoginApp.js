import React from 'react';

import Button from '../components/Button';
import PopUp  from '../components/PopUp';

import { authenticate } from '../_actions/api_actions';
import { withRouter } from '../scripts/router_hoc';
import { delay } from '../scripts/anim-util';

import './css/LoginApp.css';

class LoginApp extends React.Component {

  constructor() {
    super();
    this.mailInput = React.createRef();
    this.pwInput = React.createRef();

    this.state = {
      message:""
    }
  }
  
  async login() {
    
    let mail = this.mailInput.current.value;
    let pw   = this.pwInput.current.value;
    
    if(!this.checkForm()) return;
    
    let success = await authenticate(mail, pw);

    console.log(success);

    if(success) this.props.navigate("/");
    else { 
      this.setState(() => ({ message: "Adresse mail ou mot de passe incorrect" }), () => { 
        this.removeMessage();
      });
    }
  }

  checkForm() {
    let formValid = true;
    
    if(this.mailInput.current.value.length > 255) formValid = false;
    if(!this.mailInput.current.value.toLowerCase().match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )) {formValid = false;console.log("ta mère la regex");}
    if(this.pwInput.current.value.length > 255) formValid = false;

    return formValid;
  }

  async removeMessage() {
    await delay(2000);
    this.setState(() => ({ message: "" }));
  }

  render() {

    if(localStorage.getItem('access_token')) { 
      this.props.navigate("/");
      return null;
    }

    let popUp = null;
    if(this.state.message !== "")
      popUp = <PopUp label={this.state.message} />;

    return (
      <div className="LoginApp">
        <div id="login-page">
          <div id="form-title">Connexion</div>
          <div className="form-input">
            <input type="text" ref={this.mailInput} required/>
            <div className="placeholder">Adresse mail</div> 
          </div>
          <div className="form-input">
            <input type="password" ref={this.pwInput} required/>
            <div className="placeholder">Mot de passe</div>
          </div>
          <div className="login-button">
            <Button label="Se connecter" action={() => this.login()}/>
          </div>
        </div>
        <div className="pop-up-wrapper">{popUp}</div>
      </div>
    );
  }
}

export default withRouter(LoginApp);
