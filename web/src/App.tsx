import { mergeStyleSets } from '@fluentui/react';
import { ensureArray, ensureObject, ensureType } from '@porkbellypro/crm-shared';
import { Buffer } from 'buffer';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  BrowserRouter, MemoryRouter, Redirect, Route, Switch, useHistory,
} from 'react-router-dom';
import {
  AppProvider, IAppContext, ISettings, IUser,
} from './AppContext';
import { Header } from './components/Header';
import {
  CardFieldMethodsFactory, CardMethods, ICardData, ICardProperties, fromRaw, implement,
} from './controllers/Card';
import { ResponseStatus } from './ResponseStatus';
import { Home } from './views/Home';
import { Login } from './views/Login';

const getClassNames = () => {
  const headerHeight = '60px';

  return mergeStyleSets({
    header: {
      height: headerHeight,
      left: '0',
      position: 'fixed',
      right: '0',
    },
    body: {
      bottom: '0',
      position: 'fixed',
      left: '0',
      right: '0',
      top: headerHeight,
    },
  });
};

export interface IAppProps {
  useMemoryRouter?: boolean;
}

function notAcceptable(): ResponseStatus {
  return new ResponseStatus({
    ok: false,
    status: 406,
    statusText: 'Not Acceptable',
  });
}

interface ICardOverrideData {
  readonly base?: ICardData;
  readonly overrides: Partial<ICardProperties>;
}

interface IUserStatic {
  readonly username: string;
  readonly settings: ISettings;
  readonly cards: readonly ICardData[];
  readonly overrides: readonly ICardOverrideData[];
}

type GetMeResult = {
  status: ResponseStatus;
  user?: IUserStatic;
};

async function getMe(): Promise<GetMeResult> {
  const res = await fetch('/api/me', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) return { status: new ResponseStatus(res) };

  try {
    if (res.headers.get('Content-Type')?.startsWith('application/json;') !== true) {
      throw new Error();
    }

    const body = ensureObject(await res.json());
    const username = ensureType(body.username, 'string');
    const settings = ensureObject(body.settings);
    const cards = ensureArray(body.cards).map(fromRaw);

    return {
      status: new ResponseStatus(res),
      user: {
        username,
        settings,
        cards,
        overrides: [],
      },
    };
  } catch {
    return { status: notAcceptable() };
  }
}

const AppComponent: React.VoidFunctionComponent = () => {
  const [userState, setUser] = useState<IUserStatic | null>();
  const history = useHistory();

  const updateMe: () => Promise<ResponseStatus> = async () => {
    const { status, user } = await getMe();
    const { ok } = status;

    if (ok) {
      if (user == null) throw new Error('Expected result.user to be non-null');

      setUser(user);
    }

    return status;
  };

  if (userState === undefined) {
    updateMe();
  }

  const user: IUser | null = userState == null
    ? null
    : {
      username: userState.username,
      settings: userState.settings,
      cards: userState?.cards.map((card) => {
        const override = userState.overrides.find(({ base }) => base === card);
        const cardMethods: CardMethods = {
          update(updates) {
            if (override == null) {
              setUser({
                ...userState,
                overrides: [...userState.overrides,
                  {
                    base: card,
                    overrides: updates,
                  }],
              });
            } else {
              const { overrides: { image } } = override;
              if (image != null && updates.image !== undefined) {
                URL.revokeObjectURL(image[1]);
              }
              const overrides: Partial<ICardProperties> = {
                ...override.overrides,
                ...updates,
              };
              setUser({
                ...userState,
                overrides: userState.overrides.map((elem) => {
                  if (elem.base === card) {
                    return {
                      base: card,
                      overrides,
                    };
                  }
                  return elem;
                }),
              });
            }
          },
          async commit() {
            if (card.id == null) throw new Error('card.id is nullish');

            if (override == null) {
              return new ResponseStatus({
                ok: true,
                status: 200,
                statusText: 'OK',
              });
            }

            const { overrides } = override;
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const bodyObj: any = Object.fromEntries(Object
              .entries(overrides)
              .filter(([k, v]) => k !== 'image' && v !== undefined)
              .concat([['id', card.id]]));
            const { image } = overrides;
            if (image !== undefined) {
              if (image === null) {
                bodyObj.image = null;
              } else {
                const [blob] = image;
                bodyObj.image = Buffer.from(await blob.arrayBuffer()).toString('base64');
              }
            }
            const body = JSON.stringify(bodyObj);
            const res = await fetch('/api/card', {
              method: 'PATCH',
              body,
              headers: {
                'Content-Type': 'application/json',
              },
            });
            if (res.ok) {
              const data = await res.json();
              const updated = fromRaw(data);
              setUser({
                ...userState,
                cards: userState.cards.map((that) => {
                  if (that === card) return updated;
                  return that;
                }),
              });
            }
            return new ResponseStatus(res);
          },
          async delete() {
            const res = await fetch('/api/card', {
              method: 'DELETE',
              body: JSON.stringify({
                id: card.id,
              }),
              headers: {
                'Content-Type': 'application/json',
              },
            });
            if (res.ok) {
              setUser({
                ...userState,
                cards: userState.cards.filter((that) => that !== card),
              });
            }
            return new ResponseStatus(res);
          },
        };
        const fieldMethodsFactory: CardFieldMethodsFactory = (field) => ({
          update({ key, value }) {
            const base = override?.overrides.fields ?? card.fields;
            cardMethods.update({
              fields: base.map(
                (existing) => (field === existing
                  ? { key: key ?? existing.key, value: value ?? existing.value }
                  : existing),
              ),
            });
          },
          remove() {
            const base = override?.overrides.fields ?? card.fields;
            cardMethods.update({
              fields: base.filter((existing) => field !== existing),
            });
          },
        });
        let data = card;
        if (override != null) {
          const { overrides: { image } } = override;
          let imageStr: string | undefined = card.image;
          if (image !== undefined) imageStr = image == null ? undefined : image[1];
          data = {
            ...card,
            ...override.overrides,
            image: imageStr,
          };
        }
        return implement(data, cardMethods, fieldMethodsFactory);
      }),
    };

  const context: IAppContext = {
    searchQuery: '',
    user,
    update() { },
    showCardDetail() { },
    login(username, password, register) {
      return (async function loginAsync() {
        const body = {
          username,
          password: Buffer.from(
            await crypto.subtle.digest(
              'SHA-256',
              Buffer.from(password),
            ),
          ).toString('hex'),
        };
        const endpoint = register ? '/api/register' : '/api/login';

        const res = await fetch(endpoint, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          if (register) history.push('/login');
          else {
            return updateMe();
          }
        }

        return new ResponseStatus(res);
      }());
    },
    logout() {
      return (async function logoutAsync() {
        const res = await fetch('/api/logout', { method: 'POST' });
        if (res.ok) setUser(null);

        return new ResponseStatus(res);
      }());
    },
  };

  const { header, body } = getClassNames();

  const loggedIn = userState != null;

  return (
    <AppProvider value={context}>
      <div className={header}>
        <Header />
      </div>
      <div className={body}>
        <Switch>
          <Route exact path='/'>
            {!loggedIn && <Redirect to='/login' />}
            <Home />
          </Route>
          <Route exact path='/login'>
            {loggedIn && <Redirect to='/' />}
            <Login />
          </Route>
          <Route exact path='/register'>
            {loggedIn && <Redirect to='/' />}
            <Login registering />
          </Route>
          <Route>
            <Redirect to='/' />
          </Route>
        </Switch>
      </div>
    </AppProvider>
  );
};

export const App: React.VoidFunctionComponent<IAppProps> = ({ useMemoryRouter }) => {
  type RouterType = typeof MemoryRouter & typeof BrowserRouter;
  const Router: RouterType = useMemoryRouter ? MemoryRouter : BrowserRouter;

  return (
    <Router>
      <AppComponent />
    </Router>
  );
};

App.propTypes = {
  useMemoryRouter: PropTypes.bool,
};

App.defaultProps = {
  useMemoryRouter: false,
};
