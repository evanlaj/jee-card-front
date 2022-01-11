import './css/Button.css';

function Card({label = "Label", action = () => null}) {

  function blurAndAction(event) {
    event.target.blur();
    action();
  }

  return (
    <button className="button" onClick={(e) => blurAndAction(e)}>{label}</button>
  );
}

export default Card;
