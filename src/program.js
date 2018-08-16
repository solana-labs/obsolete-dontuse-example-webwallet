import EventEmitter from 'event-emitter';
import jayson from 'jayson/lib/client/browser';
import fetch from 'node-fetch';
import promisify from 'promisify';

const promisify_jayson = promisify.object({
  request: promisify.cb_func(),
});

const rpcClient = promisify_jayson(jayson(
  async (request, callback) => {
    const options = {
      method: 'POST',
      body: request,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    try {
      const res = await fetch(window.location.origin, options);
      const text = await res.text();
      callback(null, text);
    } catch (err) {
      callback(err);
    }
  }
));


export class Program {
  modified = false;
  language = 'Rust'; // 'C'
  name = '';
  description = '';
  source = '';
  uri = '';

  _ee = new EventEmitter();

  async load(uri) {
    console.log('Loading program:', uri);
    try {
      const res = await rpcClient.request('load', [uri]);
      console.log('load result', res);
      // TODO: Validate res.result with Joi
      if (res.error) {
        throw new Error(res.error.message);
      }
      const program = res.result;

      this.description = program.description;
      this.language = program.language;
      this.name = program.name;
      this.source = program.source;
      this.uri = program.uri;
      this.modified = false;
      this._ee.emit('modified');
    } catch (err) {
      console.log('Failed to load program:', err);
    }
  }

  async save() {
    console.log('Saving program:', this.uri);

    const program = {
      description: this.description,
      language: this.language,
      name: this.name,
      source: this.source,
      uri: this.uri,
    };
    const res = await rpcClient.request('save', [program]);
    console.log('save result', res);
    // TODO: Validate res.result with Joi
    if (res.error) {
      throw new Error(res.error.message);
    }
    const uri = res.result;

    this.uri = uri;
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

