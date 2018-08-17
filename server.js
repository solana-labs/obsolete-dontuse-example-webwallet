import bodyParser from 'body-parser';
import express from 'express';
import jayson from 'jayson';
import path from 'path';
import fs from 'mz/fs';
import mkdirp from 'mkdirp-promise';
import sha256 from 'sha256';
import base64 from 'base64it';
import joi from 'joi';

const port = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

const programSchema = joi.object().keys({
  language: joi.string().valid('Rust', 'C').required(),
  name: joi.string().allow('').max(256),
  description: joi.string().allow('').max(2048),
  source: joi.string().max(0xffff),
});

class FileStore {
  dir = path.join(__dirname, 'store');

  async load(uri) {
    const filename = path.join(this.dir, uri);
    const data = await fs.readFile(filename, 'utf8');
    const program = JSON.parse(data);
    return program;
  }

  async save(uri, program) {
    await mkdirp(this.dir);
    const filename = path.join(this.dir, uri);
    await fs.writeFile(filename, JSON.stringify(program), 'utf8');
    return uri;
  }
}

const store = new FileStore();

const rpcServer = jayson.server({
  load: async (args, callback) => {
    try {
      const loadSchema = joi.array().min(1).max(1).items(
        joi.string().required().min(16).max(16).regex(/^[a-z0-9]+$/)
      );
      const [uri] = joi.attempt(args, loadSchema);

      console.log('load ', uri);
      const program = await store.load(uri);
      joi.assert(program, programSchema);
      callback(null, program);
    } catch (err) {
      console.log('load failed:', err);
      callback(err);
    }
  },

  save: async (args, callback) => {
    try {
      const [program] = joi.attempt(
        args,
        joi.array().min(1).max(1).items(programSchema)
      );

      const uri = base64.encode(
        sha256(
          JSON.stringify(program)
        )
      ).toLowerCase().substr(0, 16);
      console.log('save', uri, program);
      await store.save(uri, program);
      callback(null, uri);
    } catch (err) {
      console.log('save failed:', err);
      callback(err);
    }
  },
});
app.use(rpcServer.middleware());

app.listen(port);
