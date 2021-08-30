import { mergeStyleSets } from '@fluentui/react';
import { History } from 'history';
import PropTypes from 'prop-types';
import React, { createContext, useContext } from 'react';
import {
  BrowserRouter, Route, Router, RouterProps, Switch,
} from 'react-router-dom';
import { Header } from './components/Header';
import { ICard } from './controllers/Card';
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
  login(username: string, password: string, register?: boolean): void;
  logout(): void;
}

const appContext = createContext<IAppContext | undefined>(undefined);

export const AppProvider = appContext.Provider;

export function useApp(): IAppContext {
  const context = useContext(appContext);
  if (context == null) throw new Error('context is null');

  return context;
}

const getClassNames = () => mergeStyleSets({
  contentRoot: {
    height: '100%',
  },
});

export interface IAppProps {
  history?: RouterProps['history'];
}

export const App: React.VoidFunctionComponent<IAppProps> = ({ history }) => {
  const context: IAppContext = {
    searchQuery: '',
    user: null,
    update() { },
    showCardDetail() { },
    login() {},
    logout() {},
  };

  const { contentRoot } = getClassNames();

  const content = (
    <Switch>
      <Route path='/'>
        <Home />
      </Route>
      <Route path='/login'>
        <Login />
      </Route>
      <Route path='/register'>
        <Login registering />
      </Route>
    </Switch>
  );
  return (
    <AppProvider value={context}>
      <Header />
      <div className={contentRoot}>
        {history != null
          ? <Router history={history}>{content}</Router>
          : <BrowserRouter>{content}</BrowserRouter>}
      </div>
    </AppProvider>
  );
};

App.propTypes = {
  history: PropTypes.object as React.Validator<History | null | undefined> | undefined,
};

App.defaultProps = {
  history: undefined,
};
