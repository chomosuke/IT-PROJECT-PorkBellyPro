import { randomBytes } from 'crypto';
import { readFile } from 'fs/promises';
import { getType } from 'mime';
import { normalize, resolve } from 'path';
import {
  InterceptMockData, InterceptRequest, Response, closeBrowser, goto, intercept, openBrowser,
} from 'taiko';

type RespondFunction = (response: InterceptMockData) => Promise<void>;

// Set 2 minutes timeout because browser testing is slow.
jest.setTimeout(120000);

beforeEach(async () => {
  await openBrowser();
});

afterEach(async () => {
  await closeBrowser();
});

export type MockApiHandler = (
  match: RegExpExecArray,
  respond: RespondFunction,
  request: InterceptRequest['request'],
) => Promise<boolean | void>;

const SERVER_PORT = process.env.SERVER_PORT ?? 80;

/**
 * Requests that network requests to http://localhost/ be intercepted. This allows tests to run
 * without actually starting server and database instances by mocking server responses.
 * @param mockHandlers Zero or more API route handlers given as pairs of [pattern, handler]s.
 * @returns A promise that resolves when the browser automation tool confirms the request.
 */
export function interceptRequests(
  ...mockHandlers: [pattern: RegExp, handler: MockApiHandler][]
): Promise<void> {
  const reRoot = new RegExp(`^http://localhost:${SERVER_PORT}(/.*)$`, 'i');
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
  async function wrappedMockApiHandler(
    respond: RespondFunction,
    request: InterceptRequest['request'],
  ) {
    const match = reApi.exec(request.url);
    if (match == null) return false;

    const path = match[1];
    for (let i = 0; i < mockHandlers.length; i += 1) {
      const [pattern, handler] = mockHandlers[i];
      const pathMatch = pattern.exec(path);
      if (pathMatch != null) {
        /*
         * Using await inside this loop is intended because later handlers should not run if the
         * current one decides that the request had been handled.
         */
        // eslint-disable-next-line no-await-in-loop
        const handled = await handler(pathMatch, respond, request);
        if (handled ?? true) {
          return true;
        }
      }
    }

    await respond({
      status: 404,
    });

    return true;
  }

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

  return intercept(`http://localhost:${SERVER_PORT}/`, async ({ request, respond }) => {
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
 * Requests the automated browser to navigate to http://localhost/. Use {@link goto} if you wish to
 * navigate to some other URL.
 * @returns A promise that resolves when the browser automation tool confirms the request.
 */
export function gotoHome(): Promise<Response> {
  return goto(`http://localhost:${SERVER_PORT}/`, { waitForNavigation: false });
}

export function randomString(size?: number): string {
  return randomBytes(size ?? 16).toString('hex');
}

export function delay(ms?: number): Promise<void> {
  return new Promise((promiseResolve) => setTimeout(promiseResolve, ms ?? 1000));
}
