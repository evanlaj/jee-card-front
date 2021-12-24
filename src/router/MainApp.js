import { BrowserRouter, Routes, Route } from 'react-router-dom';

import TestApp from '../pages/TestApp'
import BlackJackApp from '../pages/BlackJackApp'
import WarApp from '../pages/WarApp'

function MainApp() {
  return (
    <div>
      {/* ON PEUT METTRE DES CHOSES AVANT */}
      <BrowserRouter>
        <Routes>
          <Route exact path='/pile'      element={<TestApp />}      />
          <Route exact path='/memory'    element={<TestApp />}      />
          <Route exact path='/blackjack' element={<BlackJackApp />} />
          <Route exact path='/war'       element={<WarApp />}       />
        </Routes>
      </BrowserRouter>
      {/* ON PEUT METTRE DES CHOSES APRÈS */}
    </div>
  );
}

export default MainApp;
