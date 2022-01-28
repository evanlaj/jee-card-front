import React from 'react';

import Button from '../components/Button';
import PopUp  from '../components/PopUp';

import { saveUser } from '../_actions/api_actions';
import { withRouter } from '../scripts/router_hoc';
import { delay } from '../scripts/anim-util';

import './css/RegisterApp.css';

const CONTAINS_LOWER_CASE = /(.*[a-z].*)/
const CONTAINS_UPPER_CASE = /(.*[A-Z].*)/
const CONTAINS_NUMBER     = /(.*[0-9].*)/
const CONTAINS_8_OR_MORE  = /(.{8,50})/

class RegisterApp extends React.Component {
  
  constructor() {
    super();
    this.mailInput   = React.createRef();
    this.pseudoInput = React.createRef();
    this.pwInput     = React.createRef();

    this.state = {
      message: "",
      pwContainsLowerCase: false,
      pwContainsUpperCase: false,
      pwContainsNumber: false,
      pwContains8OrMore: false
    }
  }

  componentDidMount() {
    if(localStorage.getItem('access_token')) return;
    this.pwInput.current.addEventListener('input', (e) => { this.checkPasswordValidity(); });
  }
  
  async register() {
    let pseudo = this.pseudoInput.current.value;
    let mail   = this.mailInput.current.value;
    let pw     = this.pwInput.current.value;
    
    let success = this.checkForm();


    if(success) success = await saveUser(pseudo, mail, pw);

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
    )) {formValid = false;}
    if(this.pwInput.current.value.length > 50) formValid = false;

    formValid = formValid && this.state.pwContainsLowerCase;
    formValid = formValid && this.state.pwContainsUpperCase;
    formValid = formValid && this.state.pwContainsNumber;
    formValid = formValid && this.state.pwContains8OrMore;

    return formValid;
  }

  checkPasswordValidity() {

    let value = this.pwInput.current.value;

    let pwContainsLowerCase = value.match(CONTAINS_LOWER_CASE);
    let pwContainsUpperCase = value.match(CONTAINS_UPPER_CASE);
    let pwContainsNumber    = value.match(CONTAINS_NUMBER);
    let pwContains8OrMore   = value.match(CONTAINS_8_OR_MORE);

    this.setState(() => ({
      pwContainsLowerCase: pwContainsLowerCase,
      pwContainsUpperCase: pwContainsUpperCase,
      pwContainsNumber   : pwContainsNumber,
      pwContains8OrMore  : pwContains8OrMore,
    }));
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
          <div className="register-form">
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
          <div className="separator-register"></div>
          <div className="password-rules-wrapper">
            <div>Le mot de passe contient :</div>
            <div className="password-rules">
              <div> {this.state.pwContainsLowerCase && "✓"} au moins une lettre minuscule</div>
              <div> {this.state.pwContainsUpperCase && "✓"} au moins une lettre majuscule</div>
              <div> {this.state.pwContainsNumber    && "✓"} au moins un chiffre</div>
              <div> {this.state.pwContains8OrMore   && "✓"} au moins 8 caractères</div>
            </div>
          </div>
        </div>
          <div className="pop-up-wrapper">{popUp}</div>
      </div>
    );
  }
}

export default withRouter(RegisterApp);
