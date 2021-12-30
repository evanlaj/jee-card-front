import Button from './Button'

import './css/EndModal.css';

function EndModal({info, actionReplay, actionQuit}) {
  return (
    <div className="em-blur">
      <div className="em-wrapper">
        <div className="em-bg">
          <svg id="sunburst" width="715" height="715" viewBox="0 0 715 715" xmlns="http://www.w3.org/2000/svg">
            <path d="M595.849 91.6455L357.406 357.458L622.969 117.664L595.849 91.6455Z" fill="url(#radial_sunburst)"/>
            <path d="M535.279 47.9641L357.406 357.458L567.225 67.7853L535.279 47.9641Z" fill="url(#radial_sunburst)"/>
            <path d="M466.934 17.8102L357.406 357.46L502.31 30.5677L466.934 17.8102Z" fill="url(#radial_sunburst)"/>
            <path d="M393.804 2.50387L357.407 357.465L431.064 7.64004L393.804 2.50387Z" fill="url(#radial_sunburst)"/>
            <path d="M319.082 2.70963L357.407 357.469L356.597 0L319.082 2.70963Z" fill="url(#radial_sunburst)"/>
            <path d="M246.035 18.4197L357.408 357.472L282.166 7.98265L246.035 18.4197Z" fill="url(#radial_sunburst)"/>
            <path d="M177.856 48.9462L357.408 357.473L211.024 31.2379L177.856 48.9462Z" fill="url(#radial_sunburst)"/>
            <path d="M117.524 92.9591L357.408 357.476L146.279 68.7536L117.524 92.9591Z" fill="url(#radial_sunburst)"/>
            <path d="M67.6762 148.534L357.409 357.481L90.7618 118.889L67.6762 148.534Z" fill="url(#radial_sunburst)"/>
            <path d="M30.4954 213.242L357.413 357.487L46.9025 179.453L30.4954 213.242Z" fill="url(#radial_sunburst)"/>
            <path d="M7.60353 284.255L357.419 357.493L16.615 247.799L7.60353 284.255Z" fill="url(#radial_sunburst)"/>
            <path d="M0 358.469L357.425 357.501L1.22203 320.939L0 358.469Z" fill="url(#radial_sunburst)"/>
            <path d="M8.01645 432.641L357.429 357.508L1.39562 395.678L8.01645 432.641Z" fill="url(#radial_sunburst)"/>
            <path d="M31.3053 503.53L357.434 357.516L17.131 468.749L31.3053 503.53Z" fill="url(#radial_sunburst)"/>
            <path d="M68.8503 568.036L357.443 357.523L47.742 536.957L68.8503 568.036Z" fill="url(#radial_sunburst)"/>
            <path d="M119.008 623.341L357.451 357.528L91.8881 597.323L119.008 623.341Z" fill="url(#radial_sunburst)"/>
            <path d="M179.59 667.027L357.463 357.532L147.644 647.206L179.59 667.027Z" fill="url(#radial_sunburst)"/>
            <path d="M247.948 697.186L357.476 357.536L212.572 684.429L247.948 697.186Z" fill="url(#radial_sunburst)"/>
            <path d="M321.095 712.498L357.491 357.537L283.835 707.362L321.095 712.498Z" fill="url(#radial_sunburst)"/>
            <path d="M395.832 712.29L357.506 357.531L358.316 715L395.832 712.29Z" fill="url(#radial_sunburst)"/>
            <path d="M468.894 696.579L357.521 357.527L432.763 707.016L468.894 696.579Z" fill="url(#radial_sunburst)"/>
            <path d="M537.088 666.044L357.536 357.517L503.92 683.752L537.088 666.044Z" fill="url(#radial_sunburst)"/>
            <path d="M597.433 622.022L357.549 357.504L568.678 646.227L597.433 622.022Z" fill="url(#radial_sunburst)"/>
            <path d="M647.292 566.439L357.56 357.492L624.207 596.084L647.292 566.439Z" fill="url(#radial_sunburst)"/>
            <path d="M684.485 501.724L357.567 357.479L668.078 535.513L684.485 501.724Z" fill="url(#radial_sunburst)"/>
            <path d="M707.39 430.703L357.574 357.464L698.378 467.159L707.39 430.703Z" fill="url(#radial_sunburst)"/>
            <path d="M715 356.48L357.575 357.448L713.778 394.009L715 356.48Z" fill="url(#radial_sunburst)"/>
            <path d="M706.983 282.3L357.57 357.433L713.604 319.263L706.983 282.3Z" fill="url(#radial_sunburst)"/>
            <path d="M683.693 211.404L357.564 357.418L697.867 246.185L683.693 211.404Z" fill="url(#radial_sunburst)"/>
            <path d="M646.147 146.89L357.555 357.404L667.256 177.969L646.147 146.89Z" fill="url(#radial_sunburst)"/>
            <defs>
              <radialGradient id="radial_sunburst" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(357.406 357.458) rotate(-90.0692) scale(336.459 336.142)">
                <stop stopColor="white" stopOpacity="0.4"/>
                <stop offset="1" stopColor="white" stopOpacity="0"/>
              </radialGradient>
            </defs>
          </svg>
          <div className="em-ornament"></div>
          <div className="em-body">
            <div className="em-info">{info}</div>
            <div className="em-buttons">
              <Button action={actionReplay} label="Rejouer"/>
              <Button action={actionQuit} label="Quitter"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EndModal;
