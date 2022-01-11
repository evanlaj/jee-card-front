import { NavLink } from 'react-router-dom';

import Button from './Button';

import './css/Header.css';

function Header({open =  true, buttonAction = () => null}) {
  return (
      <div id="header" className={(open ? "header-open":"")}>
          <button className="header-button" onClick={buttonAction}>
            <div className="header-bar bar1"></div>
            <div className="header-bar bar2"></div>
            <div className="header-bar bar3"></div>
          </button>
          { open && 
            <nav>
              <NavLink to="/war"><Button label="Bataille"/></NavLink>
              <NavLink to="/blackjack"><Button label="Blackjack"/></NavLink>
              <NavLink to="/memory"><Button label="Memory"/></NavLink>
            </nav>
          }
    </div>
  );
}

export default Header;
