import { NavLink } from 'react-router-dom';
import { checkAvailability } from '../_actions/api_actions';
import React, { useState } from 'react';

import Button from './Button';

import './css/Header.css';

function Header({open =  true, buttonAction = () => null, session = null}) {
  
  const [warAvailability, setWarAvailability] = useState(true);
  const [blackJackAvailability, setBlackJackAvailability] = useState(true);
  const [memoryAvailability, setMemoryAvailability] = useState(true);

  checkAvailability("War").then((data) => {
    setWarAvailability(data);
  });

  checkAvailability("Black Jack").then((data) => {
    setBlackJackAvailability(data);
  });

  checkAvailability("Memory").then((data) => {
    setMemoryAvailability(data);
  });
  
  let headerButton = 
    <button className="header-button" onClick={buttonAction}>
      <div className="header-bar bar1"></div>
      <div className="header-bar bar2"></div>
      <div className="header-bar bar3"></div>
    </button>;

  let adminButton = null;
  if(session && (session.role === "ROLE_ADMIN")) {
    adminButton = <NavLink to="/administration"><Button label="Administration"/></NavLink>
  }
  
  if(session && session.name) {
    return (
      <div id="header" className={(open ? "header-open":"")}>
          {headerButton}
          { open && 
            <nav>
              {warAvailability && (<NavLink to="/war"><Button label="Bataille"/></NavLink>)}
              {blackJackAvailability && (<NavLink to="/blackjack"><Button label="Blackjack"/></NavLink>)}
              {memoryAvailability && (<NavLink to="/memory"><Button label="Memory"/></NavLink>)}
              {adminButton}
              <NavLink to="/profil"><Button label="Profil"/></NavLink>
            </nav>
          }
      </div>
    )
  } else {
    return (
      <div id="header" className={(open ? "header-open":"")}>
          {headerButton}
          { open && 
            <nav>
              <NavLink to="/login"><Button label="Se connecter"/></NavLink>
              <NavLink to="/register"><Button label="S'enregistrer"/></NavLink>
              <NavLink to="/"><Button label="Page d'accueil"/></NavLink>
            </nav>
          }
      </div>
    );
  }
}

export default Header;
