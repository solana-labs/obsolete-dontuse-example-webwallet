import localforage from 'localforage';
import EventEmitter from 'event-emitter';
import * as web3 from '@solana/web3.js';

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

    if (typeof this.networkEntryPoint !== 'string') {
      this.networkEntryPoint = 'https://api.testnet.solana.com';
    }

    if (!this.accountSecretKey) {
      await this.createAccount();
      return;
    }
    this._ee.emit('change');
  }

  async createAccount() {
    const account = new web3.Account();
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

