import { mergeStyleSets } from '@fluentui/react';
import { ensureArray, ensureObject, ensureType } from '@porkbellypro/crm-shared';
import { Buffer } from 'buffer';
import PropTypes from 'prop-types';
import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  BrowserRouter, MemoryRouter, Redirect, Route, Switch, useHistory,
} from 'react-router-dom';
import {
  AppProvider, IAppContext, ISettings, IUser,
} from './AppContext';
import { Header } from './components/Header';
import {
  CardFieldMethodsFactory,
  CardMethods,
  ICard,
  ICardData,
  ICardProperties,
  cardDataDefaults,
  fromRaw,
  implement,
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
      },
    };
  } catch {
    return { status: notAcceptable() };
  }
}

function notImplemented() {
  return new Error('Not implemented');
}

function implementDelete(
  card: ICardData,
  userState: IUserStatic,
  setUser: Dispatch<SetStateAction<IUserStatic | null | undefined>>,
): ICard['delete'] {
  return (async () => {
    if (card.id == null) throw new Error('card.id is nullish');

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
  });
}

function implementCard(
  card: ICardData,
  userState: IUserStatic,
  setUser: Dispatch<SetStateAction<IUserStatic | null | undefined>>,
): ICard {
  const cardMethods: CardMethods = {
    update() { throw notImplemented(); },
    commit() { return Promise.reject(notImplemented()); },
    delete: implementDelete(card, userState, setUser),
  };
  const fieldMethodsFactory: CardFieldMethodsFactory = () => ({
    update() { throw notImplemented(); },
    remove() { throw notImplemented(); },
  });
  return implement(card, cardMethods, fieldMethodsFactory);
}

function implementCardOverride(
  data: ICardOverrideData,
  setDetail: Dispatch<SetStateAction<ICardOverrideData | null>>,
  userState: IUserStatic,
  setUser: Dispatch<SetStateAction<IUserStatic | null | undefined>>,
): ICard {
  const { base, overrides: { image, ...overrides } } = data;
  const cardData: ICardData = {
    ...cardDataDefaults,
    ...base,
    ...overrides,
  };
  if (image !== undefined) {
    cardData.image = image === null ? undefined : image;
  }
  const cardMethods: CardMethods = {
    update(updates) {
      const newOverrides: Partial<ICardProperties> = {
        ...data.overrides,
        ...updates,
      };
      setDetail({
        ...data,
        overrides: newOverrides,
      });
    },
    async commit() {
      const put = base?.id == null;

      if (!put && !Object.entries(data.overrides).some(([, v]) => v !== undefined)) {
        return new ResponseStatus({
          ok: true,
          status: 200,
          statusText: 'OK',
        });
      }

      let bodyObj;
      if (put) {
        bodyObj = Object.fromEntries(
          Object
            .entries(cardDataDefaults)
            .concat(Object.entries(overrides), [['tags', []]]),
        );
      } else {
        if (base?.id == null) throw new Error('Unreachable');
        bodyObj = Object.fromEntries(Object
          .entries(overrides)
          .concat([['id', base.id]]));
      }
      if (image !== undefined) {
        bodyObj.image = image;
      }
      const body = JSON.stringify(bodyObj);
      const res = await fetch('/api/card', {
        method: put ? 'PUT' : 'PATCH',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const raw = await res.json();
        const updated = fromRaw(raw);
        if (put) {
          setUser({
            ...userState,
            cards: userState.cards.concat(updated),
          });
        } else {
          setUser({
            ...userState,
            cards: userState.cards.map((that) => {
              if (that === base) return updated;
              return that;
            }),
          });
        }
      }
      return new ResponseStatus(res);
    },
    delete: base == null
      ? () => Promise.reject(notImplemented())
      : implementDelete(base, userState, setUser),
  };
  const fieldMethodsFactory: CardFieldMethodsFactory = (field) => ({
    update({ key, value }) {
      cardMethods.update({
        fields: cardData.fields.map(
          (existing) => (field === existing
            ? { key: key ?? existing.key, value: value ?? existing.value }
            : existing),
        ),
      });
    },
    remove() {
      cardMethods.update({
        fields: cardData.fields.filter((existing) => field !== existing),
      });
    },
  });
  return implement(cardData, cardMethods, fieldMethodsFactory);
}

const AppComponent: React.VoidFunctionComponent = () => {
  const [userState, setUserState] = useState<IUserStatic | null>();
  const [detail, setDetail] = useState<ICardOverrideData | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const history = useHistory();

  const setUser: Dispatch<SetStateAction<IUserStatic | null | undefined>> = (value) => {
    let newState: IUserStatic | null | undefined;
    if (typeof value === 'function') newState = value(userState);
    else newState = value;
    setUserState(newState);
    let newBase: ICardData | undefined;
    if (detail?.base?.id != null && newState != null) {
      newBase = newState.cards.find((card) => card.id === detail?.base?.id);
    }
    setDetail(newBase == null
      ? null
      : {
        base: newBase,
        overrides: {},
      });
  };

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
      cards: userState.cards.map((card) => implementCard(card, userState, setUser)),
      tags: [],
    };

  const context: IAppContext = {
    searchQuery,
    user,
    update({ searchQuery: query }) {
      if (query != null) setSearchQuery(query);
    },
    showCardDetail(card) {
      if (userState == null) throw new Error('userState is nullish');
      if (card == null) {
        setDetail(null);
      } else {
        const base = userState.cards.find((existing) => existing.id === card.id);
        if (base == null) throw new Error('Not found');
        setDetail({
          base,
          overrides: {},
        });
      }
    },
    newCard() {
      setDetail({
        overrides: {},
      });
    },
    newTag() { throw notImplemented(); },
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

  let override: ICard | undefined;
  if (userState != null) {
    override = detail != null
      ? implementCardOverride(
        detail,
        setDetail,
        userState,
        setUser,
      )
      : undefined;
  }

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
            {loggedIn ? <Home detail={override} /> : <Redirect to='/login' />}
          </Route>
          <Route exact path='/login'>
            {loggedIn ? <Redirect to='/' /> : <Login key='login' />}
          </Route>
          <Route exact path='/register'>
            {loggedIn ? <Redirect to='/' /> : <Login registering key='register' />}
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
