import { mergeStyleSets } from '@fluentui/react';
import { Buffer } from 'buffer';
import PropTypes from 'prop-types';
import React, { createContext, useContext, useState } from 'react';
import {
  BrowserRouter, MemoryRouter, Redirect, Route, Switch, useHistory,
} from 'react-router-dom';
import { Header } from './components/Header';
import { ICard } from './controllers/Card';
import { ResponseStatus } from './ResponseStatus';
import { Home } from './views/Home';
import { Login } from './views/Login';

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface ISettings { }

export interface IUser {
  readonly username: string;
  readonly settings: ISettings;
  readonly cards: readonly ICard[];
}

export interface IAppContextProperties {
  searchQuery: string;
}

export interface IAppContext extends Readonly<IAppContextProperties> {
  readonly user: IUser | null;
  update(props: Partial<IAppContextProperties>): void;
  showCardDetail(card: ICard | null): void;
  login(username: string, password: string, register?: boolean): Promise<ResponseStatus>;
  logout(): Promise<ResponseStatus>;
}

const appContext = createContext<IAppContext | undefined>(undefined);

export const AppProvider = appContext.Provider;

export function useApp(): IAppContext {
  const context = useContext(appContext);
  if (context == null) throw new Error('context is null');

  return context;
}

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

const AppComponent: React.VoidFunctionComponent = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const history = useHistory();

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
          else setUser({} as unknown as IUser);
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

  const loggedIn = user != null;

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
