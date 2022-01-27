import { NavLink } from 'react-router-dom';

import Button from './Button';

import './css/Header.css';

function Header({open =  true, buttonAction = () => null, session = null}) {
  
  let headerButton = 
    <button className="header-button" onClick={buttonAction}>
      <div className="header-bar bar1"></div>
      <div className="header-bar bar2"></div>
      <div className="header-bar bar3"></div>
    </button>;
  
  if(session && session.name) {
    return (
      <div id="header" className={(open ? "header-open":"")}>
          {headerButton}
          { open && 
            <nav>
              <NavLink to="/war"><Button label="Bataille"/></NavLink>
              <NavLink to="/blackjack"><Button label="Blackjack"/></NavLink>
              <NavLink to="/memory"><Button label="Memory"/></NavLink>
              <NavLink to="/"><Button label="Page d'accueil"/></NavLink>
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
