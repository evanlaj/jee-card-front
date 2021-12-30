import './css/Button.css';

function Card({label = "Label", action = () => null}) {
  return (
    <button className="button" onClick={action}>{label}</button>
  );
}

export default Card;
