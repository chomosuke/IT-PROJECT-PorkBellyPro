import React from 'react';
import { create } from 'react-test-renderer';
import { CardExtraField } from '../../../components/cardDetails/CardExtraField';
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

describe('CardExtraField tests', () => {
  test('editing', () => {
    const json = create(
      <CardExtraField
        field={cardField}
        editing
      />,
    ).toJSON();
    expect(json).toMatchInlineSnapshot(`
<div
  className="ms-Stack css-112"
>
  <div
    className="ms-TextField ms-TextField--borderless root-114"
  >
    <div
      className="ms-TextField-wrapper"
    >
      <div
        className="ms-TextField-fieldGroup fieldGroup-115"
      >
        <input
          aria-invalid={false}
          className="ms-TextField-field field-116"
          id="TextField0"
          onBlur={[Function]}
          onChange={[Function]}
          onFocus={[Function]}
          onInput={[Function]}
          type="text"
          value="a key"
        />
      </div>
    </div>
  </div>
  <div
    className="ms-StackItem css-125"
  >
    <div
      className="ms-TextField ms-TextField--borderless root-114"
    >
      <div
        className="ms-TextField-wrapper"
      >
        <div
          className="ms-TextField-fieldGroup fieldGroup-126"
        >
          <input
            aria-invalid={false}
            className="ms-TextField-field field-127"
            id="TextField3"
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
  <svg
    className="iconButton-111"
    fill="#ffffff"
    height={36}
    onClick={[Function]}
    viewBox="0 0 256 256"
    width={36}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      fill="none"
      height="256"
      width="256"
    />
    <circle
      cx="128"
      cy="128"
      fill="none"
      r="96"
      stroke="#ffffff"
      strokeMiterlimit="10"
      strokeWidth="16"
    />
    <line
      fill="none"
      stroke="#ffffff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
      x1="88"
      x2="168"
      y1="128"
      y2="128"
    />
  </svg>
</div>
`);
  });
});
