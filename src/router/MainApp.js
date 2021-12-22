import { BrowserRouter, Routes, Route } from 'react-router-dom';

import TestApp from '../pages/TestApp';
import MemoryApp from '../pages/MemoryApp';

function MainApp() {
  return (
    <div>
      {/* ON PEUT METTRE DES CHOSES AVANT */}
      <BrowserRouter>
        <Routes>
          <Route exact path='/pile' element={<TestApp />}></Route>
          <Route exact path='/memory' element={<MemoryApp />}></Route>
        </Routes>
      </BrowserRouter>
      {/* ON PEUT METTRE DES CHOSES APRÈS */}
    </div>
  );
}

export default MainApp;
