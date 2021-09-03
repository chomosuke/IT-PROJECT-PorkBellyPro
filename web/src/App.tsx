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
  CardMethods, ICardData, ICardProperties, fromRaw, implement,
} from './controllers/Card';
import { CardFieldMethods } from './controllers/CardField';
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
          commit() { return Promise.reject(); },
          delete() { return Promise.reject(); },
        };
        const fieldMethods: CardFieldMethods = {
          update() { },
        };
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
        return implement(data, cardMethods, fieldMethods);
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
