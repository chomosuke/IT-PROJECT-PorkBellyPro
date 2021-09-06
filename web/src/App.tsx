import { mergeStyleSets } from '@fluentui/react';
import { History } from 'history';
import PropTypes from 'prop-types';
import React from 'react';
import {
  BrowserRouter, Route, Router, RouterProps, Switch,
} from 'react-router-dom';
import {
  AppProvider, IAppContext,
} from './AppContext';
import { Header } from './components/Header';
import { ResponseStatus } from './ResponseStatus';
import { Home } from './views/Home';
import { Login } from './views/Login';

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
    login() {
      return Promise.resolve(new ResponseStatus({
        ok: true,
        status: 200,
        statusText: 'OK',
      }));
    },
    logout() {
      return Promise.resolve(new ResponseStatus({
        ok: true,
        status: 200,
        statusText: 'OK',
      }));
    },
  };

  const { contentRoot } = getClassNames();

  const content = (
    <Switch>
      <Route exact path='/'>
        <Home />
      </Route>
      <Route exact path='/login'>
        <p>Login page welcome!</p>
        <Login />
      </Route>
      <Route exact path='/register'>
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
