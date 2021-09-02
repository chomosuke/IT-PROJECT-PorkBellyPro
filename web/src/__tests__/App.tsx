import React from 'react';
import { create } from 'react-test-renderer';
import { App } from '../App';
import './disable-icon-warnings.helpers';

describe('App tests', () => {
  test('Simple render', () => {
    const tree = create(<App useMemoryRouter />).toJSON();
    expect(tree).toMatchInlineSnapshot(`
Array [
  <div
    className="header-53"
  />,
  <div
    className="body-54"
  />,
]
`);
  });
});
