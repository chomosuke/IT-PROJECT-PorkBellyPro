import React from 'react';
import { create } from 'react-test-renderer';
import { CardMandatoryField } from '../../../components/cardDetails/CardMandatoryField';

function notImplemented() {
  return new Error('Not implemented');
}

describe('CardMandatoryField tests', () => {
  test('editing', () => {
    const json = create(
      <CardMandatoryField
        field={{ key: 'a key', value: 'a value' }}
        editing
        onEdit={() => { throw notImplemented(); }}
      />,
    ).toJSON();
    expect(json).toMatchInlineSnapshot(`
<div
  className="ms-Stack css-55"
>
  <span
    className="viewingKey-56"
  >
    a key
  </span>
  <div
    className="ms-StackItem css-57"
  >
    <div
      className="ms-TextField ms-TextField--borderless root-59"
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
            type="text"
            value="a value"
          />
        </div>
      </div>
    </div>
  </div>
</div>
`);
  });

  test('viewing', () => {
    const json = create(
      <CardMandatoryField
        field={{ key: 'a key', value: 'a value' }}
        editing={false}
        onEdit={() => { throw notImplemented(); }}
      />,
    ).toJSON();
    expect(json).toMatchInlineSnapshot(`
<div
  className="ms-Stack css-55"
>
  <span
    className="viewingKey-56"
  >
    a key
  </span>
  <span
    className="viewingValue-70"
  >
    a value
  </span>
</div>
`);
  });
});
