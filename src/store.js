import localforage from 'localforage';
import EventEmitter from 'event-emitter';

import {Web3SolAccount} from './web3-sol';

export class Store {
  constructor() {
    this._ee = new EventEmitter();
    this._lf = localforage.createInstance({
      name: 'configuration'
    });
  }

  async init() {
    for (let key of [
      'networkEntryPoint',
      'accountSecretKey', // TODO: THIS KEY IS NOT STORED SECURELY!!
    ]) {
      this[key] = await this._lf.getItem(key);
    }

    if (!this.accountSecretKey) {
      await this.createAccount();
      return;
    }
    this._ee.emit('change');
  }

  async createAccount() {
    const account = new Web3SolAccount();
    this.accountSecretKey = account.secretKey;
    this._ee.emit('change');
    await this._lf.setItem('accountSecretKey', account.secretKey);
  }

  async setNetworkEntryPoint(value) {
    this.networkEntryPoint = value;
    this._ee.emit('change');
    await this._lf.setItem('networkEntryPoint', value);
  }

  onChange(fn) {
    this._ee.on('change', fn);
  }

  removeChangeListener(fn) {
    this._ee.off('change', fn);
  }

}

