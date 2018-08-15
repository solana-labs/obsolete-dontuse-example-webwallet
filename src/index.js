import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Link,
  Route,
} from 'react-router-dom';
import {
  Jumbotron,
  Nav,
  NavItem,
} from 'react-bootstrap';

import {Ide} from './ide';
import {WalletApp} from './walletapp';

const Header = () => (
  <Nav bsStyle="tabs">
    <NavItem eventKey={1}>
      <Link to="/">Editor</Link>
    </NavItem>
    <NavItem eventKey={2}>
      <Link to="/wallet">Wallet</Link>
    </NavItem>
    <NavItem eventKey={3}>
      <Link to="/settings">Settings</Link>
    </NavItem>
  </Nav>
);

const Settings = () => (
  <Jumbotron>
    <h1>Settings</h1>
    <p>
     App settings will be placed here.
    </p>
  </Jumbotron>
);

ReactDOM.render(
  <BrowserRouter>
    <div style={{height: '100%'}}>
      <Header />
      <Route exact path='/' component={Ide} />
      <Route exact path='/wallet' component={WalletApp} />
      <Route exact path='/settings' component={Settings} />
    </div>
  </BrowserRouter>,
  document.getElementById('app'),
);

module.hot.accept();
