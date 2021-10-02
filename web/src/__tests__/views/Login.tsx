import { create } from 'react-test-renderer';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../../views/Login';
import { AppProvider, IAppContext } from '../../AppContext';

const mockApp: IAppContext = {
  searchQuery: '',
  tagQuery: [],
  newCard() { throw new Error('Not Implemented'); },
  newTag() { throw new Error('Not Implemented'); },
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
  className="root-53"
>
  <div
    className="bodyContainer-54"
  >
    <div
      className="ms-Stack contentWrapper-56"
    >
      <div
        className="ms-TextField root-58"
      >
        <div
          className="ms-TextField-wrapper"
        >
          <div
            className="ms-TextField-fieldGroup fieldGroup-59"
          >
            <input
              aria-invalid={false}
              className="ms-TextField-field field-60"
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
      <div
        className="ms-TextField root-58"
      >
        <div
          className="ms-TextField-wrapper"
        >
          <div
            className="ms-TextField-fieldGroup fieldGroup-59"
          >
            <input
              aria-invalid={false}
              className="ms-TextField-field field-60"
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
      <button
        className="ms-Button ms-Button--primary root-69"
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
          className="ms-Button-flexContainer flexContainer-70"
          data-automationid="splitbuttonprimary"
        >
          <span
            className="ms-Button-textContainer textContainer-71"
          >
            <span
              className="ms-Button-label label-73"
              id="id__6"
            >
              Log in
            </span>
          </span>
        </span>
      </button>
      <div
        className="ms-StackItem css-77"
      >
        <label
          className="ms-Label root-78"
        >
          <a
            href="/register"
            onClick={[Function]}
          >
            Register to get started
          </a>
        </label>
      </div>
      <div
        className="ms-StackItem css-77"
      >
        <label
          className="ms-Label root-78"
        >
          Can't log in?
        </label>
      </div>
    </div>
  </div>
</div>
`);
  });
});
