import './css/Header.css';

function Header({open =  true, buttonAction = () => null}) {
  return (
      <div id="header" className={(open ? "header-open":"")}>
          <button className="header-button" onClick={buttonAction}>
            <div className="header-bar bar1"></div>
            <div className="header-bar bar2"></div>
            <div className="header-bar bar3"></div>
          </button>
    </div>
  );
}

export default Header;
