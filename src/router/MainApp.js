import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { getSession } from '../_actions/session';

import Header from '../components/Header';
import HomePageApp from '../pages/HomePageApp';
import TestApp from '../pages/TestApp';
import MemoryApp from '../pages/MemoryApp';
import BlackJackApp from '../pages/BlackJackApp';
import WarApp from '../pages/WarApp';
import LoginApp from '../pages/LoginApp';
import RegisterApp from '../pages/RegisterApp';
import AdminApp from '../pages/AdminApp';
import ProfilApp from '../pages/ProfilApp';

class MainApp extends React.Component {
  
  headerOpen = false;

  constructor() {
    super();
    this.toggleHeader = this.toggleHeader.bind(this);

    this.state = {};

  }
  
  toggleHeader() {
    this.headerOpen = !this.headerOpen;
    this.forceUpdate();
    document.activeElement.blur();
  }

  async componentDidMount() {

    let session = await getSession();

    this.setState(() => ({
      session: session
    }));
  }

  render () {

    return (
      <div>
        {/* ON PEUT METTRE DES CHOSES AVANT */}
        <BrowserRouter>
          <Header open={this.headerOpen} buttonAction={this.toggleHeader} session={this.state.session}/>
          <Routes>
            <Route exact path='/'               element={<HomePageApp />}  />
            <Route exact path='/pile'           element={<TestApp />}      />
            <Route exact path='/memory'         element={<MemoryApp />}      />
            <Route exact path='/blackjack'      element={<BlackJackApp />} />
            <Route exact path='/war'            element={<WarApp />}       />
            <Route exact path="/login"          element={<LoginApp />}     />
            <Route exact path="/register"       element={<RegisterApp />}  />
            <Route exact path="/administration" element={<AdminApp />}     />
            <Route exact path="/profil"         element={<ProfilApp />}    />
          </Routes>
        </BrowserRouter>
        {/* ON PEUT METTRE DES CHOSES APR??S */}
      </div>
    );
  }
}

export default MainApp;
