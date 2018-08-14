import React from 'react';
import ReactDOM from 'react-dom';

import {WalletApp} from './walletapp';

ReactDOM.render(
  <WalletApp />,
  document.getElementById('app'),
);

module.hot.accept();
