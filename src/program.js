import EventEmitter from 'event-emitter';

export class Program {
  modified = false;
  language = 'Rust'; // 'C'
  name = '';
  description = '';
  source = '';
  uri = '';

  _ee = new EventEmitter();

  constructor() {
  }

  load(uri) {
    this.uri = uri;
    this.modified = false;

    this.name = uri;
    this.description = uri;
    this.source = uri;

    console.log('Loading program:', uri);
    this._ee.emit('modified');
  }

  save() {
    console.log('Saving program:', this.uri);
    function randomString(length) {
      let text = '';
      const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }
    this.uri = randomString(10);
    this.modified = false;
    this._ee.emit('modified');
    console.log('Saved program:', this.uri);
  }

  set(key, value) {
    //console.log(`Program: ${key}=${value}`);
    this[key] = value;
    this.modified = true;
    this._ee.emit('modified');
  }

  on(event, fn) {
    this._ee.on(event, fn);
  }

  removeListener(event, fn) {
    this._ee.removeListener(event, fn);
  }
}

