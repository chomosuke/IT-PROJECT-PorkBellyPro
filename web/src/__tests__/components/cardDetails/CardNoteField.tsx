import React from 'react';
import { create } from 'react-test-renderer';
import { CardNoteField } from '../../../components/cardDetails/CardNoteField';
import { ICardField } from '../../../controllers/CardField';

function notImplemented() {
  return new Error('Not implemented');
}

const cardField: ICardField = {
  key: 'a key',
  value: 'a value',
  update() { throw notImplemented(); },
  remove() { throw notImplemented(); },
};

describe('CardNoteField tests', () => {
  test('editing', () => {
    const json = create(
      <CardNoteField
        field={cardField}
        editing
      />,
    ).toJSON();
    expect(json).toMatchInlineSnapshot(`
<div
  className="ms-TextField ms-TextField--multiline ms-TextField--borderless root-112"
>
  <div
    className="ms-TextField-wrapper"
  >
    <div
      className="ms-TextField-fieldGroup fieldGroup-113"
    >
      <textarea
        aria-invalid={false}
        className="ms-TextField-field ms-TextField--unresizable field-114"
        id="TextField0"
        onBlur={[Function]}
        onChange={[Function]}
        onFocus={[Function]}
        onInput={[Function]}
        value="a value"
      />
    </div>
  </div>
</div>
`);
  });
});
