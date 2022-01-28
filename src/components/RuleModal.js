import './css/RuleModal.css';
import React, { useState } from 'react';

function RuleModal({open = false, text = ""}) {

    const [isOpen, setOpen] = useState(open);

    return(
        <>
            {isOpen && <div className="rule-overlay" onClick={() => setOpen(!isOpen)}></div>}
            <div className="rule-button" onClick={() => setOpen(!isOpen)}></div>
            {isOpen && <div className="rulebook"><div className="rules">{text}</div></div>}
        </>
    )
}

export default RuleModal;