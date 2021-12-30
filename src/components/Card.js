import './css/Card.css';

function Card({value, color, visible =  true}) {
    return (
      <div className="card-wrapper">
          <div className={"card " + (visible ? "visible":"")}>
            <div className={"card-front " + (color === "♦" || color === "♥" ? "red":"black")}>
                <div className="card-icon">
                    <div className="card-value">{value}</div>
                    <div className="card-color">{color}</div>
                </div>

                <div className="card-figure">{color}</div>

                <div className="card-icon">
                    <div className="card-value">{value}</div>
                    <div className="card-color">{color}</div>
                </div>
            </div>

            <div className="card-back"></div>
        </div>
    </div>
  );
}

export default Card;
