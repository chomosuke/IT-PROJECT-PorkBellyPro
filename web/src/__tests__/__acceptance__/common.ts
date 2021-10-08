import { readFile } from 'fs/promises';
import { getType } from 'mime';
import { normalize, resolve } from 'path';
import {
  InterceptMockData, closeBrowser, goto, intercept, openBrowser,
} from 'taiko';

type RespondFunction = (response: InterceptMockData) => Promise<void>;

beforeEach(async () => {
  function interceptRequests() {
    const re = /^https:\/\/localhost\/(.*)$/i;
    const dist = resolve(__dirname, '../../../../dist');

    async function tryRespondWithFile(respond: RespondFunction, path: string) {
      let body;
      try {
        body = await readFile(path);
      } catch {
        return false;
      }
      const { stringify } = JSON;
      // Oneshot override of JSON.stringify to workaround a Taiko implementation detail
      JSON.stringify = (obj) => {
        JSON.stringify = stringify;
        return obj;
      };
      await respond({
        body,
        headers: {
          'Content-Type': getType(path),
        },
      });
      return true;
    }

    function staticAsset(respond: RespondFunction, url: string) {
      const match = re.exec(url);
      if (match == null) return Promise.resolve(false);
      const path = match[1];
      const normalized = normalize(`/${path}`).substr(1);
      const resolved = resolve(dist, normalized);
      return tryRespondWithFile(respond, resolved);
    }

    function index(respond: RespondFunction) {
      return tryRespondWithFile(respond, resolve(dist, 'index.html'));
    }

    return intercept('https://localhost/', async ({ request, respond }) => {
      try {
        switch (true) {
          case await staticAsset(respond, request.url):
            break;
          case await index(respond):
            break;
          default:
            respond({
              status: 404,
            });
        }
      } catch (err) {
        console.error(err);
        respond({
          status: 500,
        });
      }
    });
  }

  await openBrowser();
  await interceptRequests();
  await goto('https://localhost/');
});

afterEach(async () => {
  await closeBrowser();
});
