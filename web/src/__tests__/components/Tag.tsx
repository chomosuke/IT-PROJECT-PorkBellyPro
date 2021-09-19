import React from 'react';
import { create } from 'react-test-renderer';
import { Tag } from '../../components/Tag';
import { ITag } from '../../controllers/Tag';

import '../disable-icon-warnings.helpers';

function notImplemented() {
  return new Error('Not implemented');
}

describe('Tag component unit tests', () => {
  test('Tag with onRemove function', () => {
    const tag: ITag = {
      id: '1',
      label: 'Tag name',
      color: '#F29057',
      commit() { throw notImplemented(); },
      delete() { throw notImplemented(); },
    };

    const json = create(
      <Tag tag={tag} onClick={() => notImplemented()} onRemove={() => notImplemented()} />,
    ).toJSON();
    expect(json).toMatchInlineSnapshot(`
<div
  className="tagContainer-53"
>
  <div
    className="ms-Stack css-54"
  >
    <button
      className="ms-Button ms-Button--default root-55"
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
        <span
          className="ms-Button-textContainer textContainer-57"
        >
          <span
            className="ms-Button-label label-59"
            id="id__0"
          >
            Tag name
          </span>
        </span>
      </span>
    </button>
    <button
      className="ms-Button ms-Button--icon root-63"
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
        <i
          aria-hidden={true}
          className="ms-Icon root-37 ms-Button-icon icon-58"
          data-icon-name="CalculatorMultiply"
          style={
            Object {
              "fontFamily": undefined,
            }
          }
        />
      </span>
    </button>
  </div>
</div>
`);
  });

  test('Tag without onRemove function', () => {
    const tag: ITag = {
      id: '1',
      label: 'Tag name',
      color: '#F29057',
      commit() { throw notImplemented(); },
      delete() { throw notImplemented(); },
    };

    const json = create(
      <Tag tag={tag} onClick={() => notImplemented()} />,
    ).toJSON();
    expect(json).toMatchInlineSnapshot(`
<div
  className="tagContainer-53"
>
  <button
    className="ms-Button ms-Button--default root-55"
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
      <span
        className="ms-Button-textContainer textContainer-57"
      >
        <span
          className="ms-Button-label label-59"
          id="id__6"
        >
          Tag name
        </span>
      </span>
    </span>
  </button>
</div>
`);
  });
});
