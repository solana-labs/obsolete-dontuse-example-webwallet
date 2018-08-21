import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Link,
  Switch,
  Route,
} from 'react-router-dom';
import {
  Nav,
  NavItem,
} from 'react-bootstrap';

import {Ide} from './ide';
import {WalletApp} from './walletapp';
import {Settings} from './settings';

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


ReactDOM.render(
  <BrowserRouter>
    <div style={{display: 'table', height: '100%', width: '100%'}}>
      <Header />
      <div style={{postition: 'relative', display: 'table-row', height: '100%'}}>
        <Switch>
          <Route path='/wallet' component={WalletApp} />
          <Route path='/settings' component={Settings} />
          <Route
            path='/:programId'
            component={(router) => {
              return <Ide history={router.history} programId={router.match.params.programId}/>;
            }}
          />
          <Route path='/' component={Ide} />
        </Switch>
      </div>
    </div>
  </BrowserRouter>,
  document.getElementById('app'),
);

module.hot.accept();
