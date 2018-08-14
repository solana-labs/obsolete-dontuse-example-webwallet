import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';

import {Ide} from './ide';
import {WalletApp} from './walletapp';

ReactDOM.render(
  <BrowserRouter>
    <div style={{height: '100%', width: '100%'}}>
      <Route exact path='/' component={Ide} />
      <Route exact path='/wallet' component={WalletApp} />
    </div>
  </BrowserRouter>,
  document.getElementById('app'),
);

module.hot.accept();
