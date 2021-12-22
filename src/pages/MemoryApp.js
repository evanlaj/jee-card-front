import React from 'react';

import Card from '../components/Card';
import CardPile from '../components/CardPile';
import MemoryBoard from '../components/MemoryBoard';

import './css/MemoryApp.css';

class MemoryApp extends React.Component {

  render() {
    return (
      <div className="App">
            <MemoryBoard/>
      </div>
    );
  }
}

export default MemoryApp;
