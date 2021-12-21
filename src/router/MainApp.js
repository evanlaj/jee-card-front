import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from '../pages/App'

function MainApp() {
  return (
    <div>
      {/* ON PEUT METTRE DES CHOSES AVANT */}
      <BrowserRouter>
        <Routes>
          <Route exact path='/pile' element={<App />}></Route>
          <Route exact path='/memory' element={<App />}></Route>
        </Routes>
      </BrowserRouter>
      {/* ON PEUT METTRE DES CHOSES APRÈS */}
    </div>
  );
}

export default MainApp;
