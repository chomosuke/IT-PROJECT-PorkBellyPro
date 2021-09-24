import React from 'react';
import { create } from 'react-test-renderer';
import { AppProvider, IAppContext } from '../../AppContext';
import { Header } from '../../components/Header';

import '../disable-icon-warnings.helpers';

function notImplemented() {
  return new Error('Not implemented');
}

describe('Header component unit tests', () => {
  test('Not logged in', () => {
    const app: IAppContext = {
      searchQuery: '',
      tagQuery: [],
      user: null,
      update() { throw notImplemented(); },
      showCardDetail() { throw notImplemented(); },
      newCard() { throw notImplemented(); },
      newTag() { throw notImplemented(); },
      login() { return Promise.reject(notImplemented()); },
      logout() { return Promise.reject(notImplemented()); },
    };
    const json = create(
      <AppProvider value={app}>
        <Header />
      </AppProvider>,
    ).toJSON();
    expect(json).toMatchInlineSnapshot(`
<div
  className="ms-Stack css-53"
>
  <div
    className="root-54"
  >
    <label
      className="ms-Label root-55"
    >
      PorkBelly
    </label>
  </div>
</div>
`);
  });

  test('Logged in', () => {
    const app: IAppContext = {
      searchQuery: '',
      tagQuery: [],
      user: {
        username: 'username',
        settings: {},
        cards: [],
        tags: [],
      },
      update() { throw notImplemented(); },
      showCardDetail() { throw notImplemented(); },
      newCard() { throw notImplemented(); },
      newTag() { throw notImplemented(); },
      login() { return Promise.reject(notImplemented()); },
      logout() { return Promise.reject(notImplemented()); },
    };
    const json = create(
      <AppProvider value={app}>
        <Header />
      </AppProvider>,
    ).toJSON();
    expect(json).toMatchInlineSnapshot(`
<div
  className="ms-Stack css-53"
>
  <div
    className="root-54"
  >
    <label
      className="ms-Label root-55"
    >
      PorkBelly
    </label>
  </div>
  <div
    className="ms-StackItem css-56"
  >
    <div
      className="ms-Stack css-57"
    >
      <div />
      <div
        className="ms-TextField root-59"
      >
        <div
          className="ms-TextField-wrapper"
        >
          <div
            className="ms-TextField-fieldGroup fieldGroup-60"
          >
            <input
              aria-invalid={false}
              className="ms-TextField-field field-61"
              id="TextField0"
              onBlur={[Function]}
              onChange={[Function]}
              onFocus={[Function]}
              onInput={[Function]}
              placeholder="Search"
              type="text"
              value=""
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <button
    className="ms-Button ms-Button--default root-70"
    data-is-focusable={true}
    onClick={[Function]}
    onKeyDown={[Function]}
    onKeyPress={[Function]}
    onKeyUp={[Function]}
    onMouseDown={[Function]}
    onMouseUp={[Function]}
    type="button"
  >
    <span
      className="ms-Button-flexContainer flexContainer-71"
      data-automationid="splitbuttonprimary"
    >
      <i
        aria-hidden={true}
        className="ms-Icon root-37 ms-Button-icon icon-73"
        data-icon-name="Add"
        style={
          Object {
            "fontFamily": undefined,
          }
        }
      />
      <span
        className="ms-Button-textContainer textContainer-72"
      >
        <span
          className="ms-Button-label label-74"
          id="id__3"
        >
          New card
        </span>
      </span>
    </span>
  </button>
  <button
    aria-controls={null}
    aria-expanded={false}
    aria-haspopup={true}
    className="ms-Button ms-Button--default ms-Button--hasMenu root-70"
    data-is-focusable={true}
    onClick={[Function]}
    onKeyDown={[Function]}
    onKeyPress={[Function]}
    onKeyUp={[Function]}
    onMouseDown={[Function]}
    onMouseUp={[Function]}
    type="button"
  >
    <span
      className="ms-Button-flexContainer flexContainer-71"
      data-automationid="splitbuttonprimary"
    >
      <i
        aria-hidden={true}
        className="ms-Icon root-37 ms-Button-icon icon-73"
        data-icon-name="Contact"
        style={
          Object {
            "fontFamily": undefined,
          }
        }
      />
      <span
        className="ms-Button-textContainer textContainer-72"
      >
        <span
          className="ms-Button-label label-74"
          id="id__6"
        >
          username
        </span>
      </span>
      <i
        aria-hidden={true}
        className="ms-Icon root-37 ms-Button-menuIcon menuIcon-75"
        data-icon-name="ChevronDown"
        style={
          Object {
            "fontFamily": undefined,
          }
        }
      />
    </span>
  </button>
</div>
`);
  });

  test('Logged in with query', () => {
    const app: IAppContext = {
      searchQuery: 'query',
      tagQuery: [],
      user: {
        username: 'username',
        settings: {},
        cards: [],
        tags: [],
      },
      update() { throw notImplemented(); },
      showCardDetail() { throw notImplemented(); },
      newCard() { throw notImplemented(); },
      newTag() { throw notImplemented(); },
      login() { return Promise.reject(notImplemented()); },
      logout() { return Promise.reject(notImplemented()); },
    };
    const json = create(
      <AppProvider value={app}>
        <Header />
      </AppProvider>,
    ).toJSON();
    expect(json).toMatchInlineSnapshot(`
<div
  className="ms-Stack css-53"
>
  <div
    className="root-54"
  >
    <label
      className="ms-Label root-55"
    >
      PorkBelly
    </label>
  </div>
  <div
    className="ms-StackItem css-56"
  >
    <div
      className="ms-Stack css-57"
    >
      <div />
      <div
        className="ms-TextField root-59"
      >
        <div
          className="ms-TextField-wrapper"
        >
          <div
            className="ms-TextField-fieldGroup fieldGroup-60"
          >
            <input
              aria-invalid={false}
              className="ms-TextField-field field-61"
              id="TextField9"
              onBlur={[Function]}
              onChange={[Function]}
              onFocus={[Function]}
              onInput={[Function]}
              placeholder="Search"
              type="text"
              value="query"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <button
    className="ms-Button ms-Button--default root-70"
    data-is-focusable={true}
    onClick={[Function]}
    onKeyDown={[Function]}
    onKeyPress={[Function]}
    onKeyUp={[Function]}
    onMouseDown={[Function]}
    onMouseUp={[Function]}
    type="button"
  >
    <span
      className="ms-Button-flexContainer flexContainer-71"
      data-automationid="splitbuttonprimary"
    >
      <i
        aria-hidden={true}
        className="ms-Icon root-37 ms-Button-icon icon-73"
        data-icon-name="Add"
        style={
          Object {
            "fontFamily": undefined,
          }
        }
      />
      <span
        className="ms-Button-textContainer textContainer-72"
      >
        <span
          className="ms-Button-label label-74"
          id="id__12"
        >
          New card
        </span>
      </span>
    </span>
  </button>
  <button
    aria-controls={null}
    aria-expanded={false}
    aria-haspopup={true}
    className="ms-Button ms-Button--default ms-Button--hasMenu root-70"
    data-is-focusable={true}
    onClick={[Function]}
    onKeyDown={[Function]}
    onKeyPress={[Function]}
    onKeyUp={[Function]}
    onMouseDown={[Function]}
    onMouseUp={[Function]}
    type="button"
  >
    <span
      className="ms-Button-flexContainer flexContainer-71"
      data-automationid="splitbuttonprimary"
    >
      <i
        aria-hidden={true}
        className="ms-Icon root-37 ms-Button-icon icon-73"
        data-icon-name="Contact"
        style={
          Object {
            "fontFamily": undefined,
          }
        }
      />
      <span
        className="ms-Button-textContainer textContainer-72"
      >
        <span
          className="ms-Button-label label-74"
          id="id__15"
        >
          username
        </span>
      </span>
      <i
        aria-hidden={true}
        className="ms-Icon root-37 ms-Button-menuIcon menuIcon-75"
        data-icon-name="ChevronDown"
        style={
          Object {
            "fontFamily": undefined,
          }
        }
      />
    </span>
  </button>
</div>
`);
  });
});
