import React from 'react';
import renderer from 'react-test-renderer';
import { App } from '../App';
import './disable-icon-warnings.helpers';

describe('App tests', () => {
  test('Simple render', () => {
    const tree = renderer.create(<App />).toJSON();

    expect(tree).toMatchInlineSnapshot(`
<div
  className="divStyles-53"
>
  <button
    className="ms-Button ms-Button--primary root-55"
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
      className="ms-Button-flexContainer flexContainer-56"
      data-automationid="splitbuttonprimary"
    >
      Hello world!
      <i
        aria-hidden={true}
        className="iconStyles-63"
        data-icon-name="Album"
      />
    </span>
  </button>
</div>
`);
  });
});
