import jayson from 'jayson/lib/client/browser';
import fetch from 'node-fetch';
import promisify from 'promisify';

const promisify_jayson = promisify.object({
  request: promisify.cb_func(),
});

export function createRpcClient(uri) {
  return promisify_jayson(jayson(
    async (request, callback) => {
      const options = {
        method: 'POST',
        body: request,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      try {
        const res = await fetch(uri, options);
        const text = await res.text();
        callback(null, text);
      } catch (err) {
        callback(err);
      }
    }
  ));
}
