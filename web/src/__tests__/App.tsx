import { createMemoryHistory } from 'history';
import React from 'react';
import { create } from 'react-test-renderer';
import { App } from '../App';
import './disable-icon-warnings.helpers';

describe('App tests', () => {
  test('Simple render', () => {
    const history = createMemoryHistory();

    const tree = create(<App history={history} />).toJSON();
    expect(tree).toMatchInlineSnapshot(`
<div
  className="contentRoot-53"
/>
`);
  });
});
