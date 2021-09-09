import { create } from 'react-test-renderer';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../../views/Login';
import { AppProvider, IAppContext } from '../../AppContext';

const mockApp: IAppContext = {
  searchQuery: '',
  newCard() { throw new Error('Not Implemented'); },
  update() { throw new Error('Not Implemented'); },
  showCardDetail() { throw new Error('Not Implemented'); },
  user: null,
  login: jest.fn(),
  logout() { throw new Error('Not Implemented'); },
};

describe('Login view render tests', () => {
  beforeAll(() => {

  });

  test('Login Render Test', () => {
    const tree = create(
      <MemoryRouter>
        <AppProvider value={mockApp}>
          <Login registering={false} key='login' />
        </AppProvider>
      </MemoryRouter>,
    ).toJSON();
    expect(tree).toMatchInlineSnapshot(`
<div
  className="bodyStyle-53"
  id="container"
>
  <div
    className="ms-Stack css-54"
  >
    <div>
      <div
        className="ms-TextField root-56"
      >
        <div
          className="ms-TextField-wrapper"
        >
          <div
            className="ms-TextField-fieldGroup fieldGroup-57"
          >
            <input
              aria-invalid={false}
              className="ms-TextField-field field-58"
              id="TextField0"
              onBlur={[Function]}
              onChange={[Function]}
              onFocus={[Function]}
              onInput={[Function]}
              placeholder="Username"
              type="text"
              value=""
            />
          </div>
        </div>
      </div>
    </div>
    <div>
      <div
        className="ms-TextField root-56"
      >
        <div
          className="ms-TextField-wrapper"
        >
          <div
            className="ms-TextField-fieldGroup fieldGroup-57"
          >
            <input
              aria-invalid={false}
              className="ms-TextField-field field-58"
              id="TextField3"
              onBlur={[Function]}
              onChange={[Function]}
              onFocus={[Function]}
              onInput={[Function]}
              placeholder="Password"
              type="password"
              value=""
            />
          </div>
        </div>
      </div>
    </div>
    <button
      className="ms-Button ms-Button--primary root-67"
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
        className="ms-Button-flexContainer flexContainer-68"
        data-automationid="splitbuttonprimary"
      >
        <span
          className="ms-Button-textContainer textContainer-69"
        >
          <span
            className="ms-Button-label label-71"
            id="id__6"
          >
            Log in
          </span>
        </span>
      </span>
    </button>
    <a
      href="/register"
      onClick={[Function]}
    >
      <label
        className="ms-Label root-75"
      >
        Register to get started
      </label>
    </a>
    <label
      className="ms-Label root-75"
    >
      Can't log in?
    </label>
  </div>
</div>
`);
  });
});
