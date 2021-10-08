import { readFile } from 'fs/promises';
import { getType } from 'mime';
import { normalize, resolve } from 'path';
import {
  InterceptMockData, InterceptRequest, closeBrowser, goto, intercept, openBrowser,
} from 'taiko';

type RespondFunction = (response: InterceptMockData) => Promise<void>;
type MockApiHandler = (
  respond: RespondFunction,
  request: InterceptRequest['request'],
) => Promise<boolean>;

// Set 2 minutes timeout because browser testing is slow.
jest.setTimeout(120000);

beforeEach(async () => {
  function interceptRequests(mockApiHandler: MockApiHandler) {
    const re = /^https:\/\/localhost(\/.*)$/i;
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
      const normalized = normalize(path).substr(1);
      const resolved = resolve(dist, normalized);
      return tryRespondWithFile(respond, resolved);
    }

    function index(respond: RespondFunction) {
      return tryRespondWithFile(respond, resolve(dist, 'index.html'));
    }

    return intercept('https://localhost/', async ({ request, respond }) => {
      try {
        switch (true) {
          case mockApiHandler != null && await mockApiHandler(respond, request):
            break;
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

  const reApi = /^https:\/\/localhost\/api(\/.*)$/i;
  const reApiRegister = /\/register/i;
  const mockApiHandler: MockApiHandler = async (respond, request) => {
    const { url } = request;
    const match = reApi.exec(url);
    if (match == null) return false;
    const path = match[1];
    switch (true) {
      case Boolean(reApiRegister.exec(path)):
        if (!request.hasPostData) await respond({ status: 400 });
        else {
          await respond({
            status: 201,
          });
        }
        break;
      default:
        await respond({
          status: 404,
        });
    }
    return true;
  };

  await openBrowser();
  await interceptRequests(mockApiHandler);
  await goto('https://localhost/');
});

afterEach(async () => {
  await closeBrowser();
});
