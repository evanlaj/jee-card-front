import React from 'react';

import Button from '../components/Button';
import PopUp  from '../components/PopUp';

import { saveUser } from '../_actions/api_actions';
import { withRouter } from '../scripts/router_hoc';
import { delay } from '../scripts/anim-util';

import './css/RegisterApp.css';

class RegisterApp extends React.Component {
  
  constructor() {
    super();
    this.mailInput   = React.createRef();
    this.pseudoInput = React.createRef();
    this.pwInput     = React.createRef();

    this.state = {
      message:""
    }
  }
  
  async register() {
    let pseudo = this.pseudoInput.current.value;
    let mail   = this.mailInput.current.value;
    let pw     = this.pwInput.current.value;
    
    if(!this.checkForm()) return;


    let success = await saveUser(pseudo, mail, pw);

    if(success) {
      this.setState(() => ({ message: "Utilisateur enregistré !" }), () => { 
        this.removeMessage();
      });
    } 
    else { 
      this.setState(() => ({ message: "Formulaire incorrect" }), () => { 
        this.removeMessage();
      });
    }
  }

  async removeMessage() {
    await delay(2000);
    this.setState(() => ({ message: "" }));
  }

  checkForm() {
    let formValid = true;
    
    if(this.pseudoInput.current.value.length > 16) formValid = false;
    if(this.mailInput.current.value.length > 255) formValid = false;
    if(!this.mailInput.current.value.toLowerCase().match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )) {formValid = false;console.log("ta mère la regex");}
    if(this.pwInput.current.value.length > 255) formValid = false;

    return formValid;
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
      <div className="RegisterApp">
        <div id="register-page">
          <div id="form-title">Inscription</div>
          <div className="form-input">
            <input type="text" required ref={this.mailInput} maxLength="255"/>
            <div className="placeholder">Adresse mail</div> 
          </div>
          <div className="form-input">
            <input type="text" required ref={this.pseudoInput} maxLength="255"/>
            <div className="placeholder">Pseudo</div>
          </div>
          <div className="form-input">
            <input type="password" required ref={this.pwInput} maxLength="255"/>
            <div className="placeholder">Mot de passe</div>
          </div>
          <div className="login-button">
            <Button label="S'enregistrer" action={() => this.register()}/>
          </div>
        </div>
        <div className="pop-up-wrapper">{popUp}</div>
      </div>
    );
  }
}

export default withRouter(RegisterApp);
