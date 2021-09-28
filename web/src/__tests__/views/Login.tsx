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
    expect(tree).toMatchInlineSnapshot();
  });
});
