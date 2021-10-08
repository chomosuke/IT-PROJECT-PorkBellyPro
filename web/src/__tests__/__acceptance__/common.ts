import { readFile } from 'fs/promises';
import { getType } from 'mime';
import { normalize, resolve } from 'path';
import {
  InterceptMockData, InterceptRequest, Response, closeBrowser, goto, intercept, openBrowser,
} from 'taiko';

type RespondFunction = (response: InterceptMockData) => Promise<void>;
export type MockApiHandler = (
  respond: RespondFunction,
  request: InterceptRequest['request'],
) => Promise<boolean>;

// Set 2 minutes timeout because browser testing is slow.
jest.setTimeout(120000);

beforeEach(async () => {
  await openBrowser();
});

afterEach(async () => {
  await closeBrowser();
});

/**
 * Requests that network requests to https://localhost/ be intercepted. This allows tests to run
 * without actually starting server and database instances.
 * @param mockApiHandler Optional /api route handler to mock API calls.
 * @returns A promise that resolves when the browser automation tool confirms the request.
 */
export function interceptRequests(mockApiHandler?: MockApiHandler): Promise<void> {
  const reRoot = /^https:\/\/localhost(\/.*)$/i;
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

  const reApi = /^\/api(\/.*)$/i;
  const wrappedMockApiHandler: MockApiHandler = mockApiHandler == null
    ? () => Promise.resolve(false)
    : async (respond, request) => {
      const match = reApi.exec(request.url);
      if (match == null) return false;

      const path = match[1];
      if (!await mockApiHandler(respond, { ...request, url: path })) {
        await respond({
          status: 404,
        });
      }

      return true;
    };

  function staticAsset(respond: RespondFunction, url: string) {
    const match = reRoot.exec(url);
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
        case await wrappedMockApiHandler(respond, request):
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

/**
 * Requests the automated browser to navigate to https://localhost/. Use {@link goto} if you wish to
 * navigate to some other URL.
 * @returns A promise that resolves when the browser automation tool confirms the request.
 */
export function gotoHome(): Promise<Response> {
  return goto('https://localhost/');
}
