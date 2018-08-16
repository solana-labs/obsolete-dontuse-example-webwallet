import bodyParser from 'body-parser';
import express from 'express';
import jayson from 'jayson';
import path from 'path';
import fs from 'mz/fs';
import uniqueFilename from 'unique-filename';
import mkdirp from 'mkdirp-promise';

const port = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

class FileStore {
  dir = path.join(__dirname, 'store');

  async load(uri) {
    console.log('load ', uri);
    const filename = path.join(this.dir, uri);
    const data = await fs.readFile(filename, 'utf8');
    const program = JSON.parse(data);
    program.uri = uri;
    return program;
  }

  async save(program) {
    await mkdirp(this.dir);
    console.log('save', program);

    const filename = uniqueFilename(this.dir);
    const uri = path.basename(filename);

    await fs.writeFile(filename, JSON.stringify(program), 'utf8');
    return uri;
  }
}

const store = new FileStore();

const rpcServer = jayson.server({
  load: async (args, callback) => {
    // TODO: Validate args with Joi. Ensure uri is [a-z0-9]+

    const [uri] = args;
    try {
      const program = await store.load(uri);
      callback(null, program);
    } catch (err) {
      callback(err);
    }
  },

  save: async (args, callback) => {
    // TODO: Validate args with Joi
    const [program] = args;

    try {
      const uri = await store.save(program);
      callback(null, uri);
    } catch (err) {
      callback(err);
    }
  },
});
app.use(rpcServer.middleware());

app.listen(port);
