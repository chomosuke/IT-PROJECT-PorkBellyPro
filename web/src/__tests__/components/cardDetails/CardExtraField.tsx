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
  className="ms-Stack css-56"
>
  <div
    className="ms-TextField ms-TextField--borderless root-58"
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
          type="text"
          value="a key"
        />
      </div>
    </div>
  </div>
  <div
    className="ms-StackItem css-69"
  >
    <div
      className="ms-TextField ms-TextField--borderless root-58"
    >
      <div
        className="ms-TextField-wrapper"
      >
        <div
          className="ms-TextField-fieldGroup fieldGroup-70"
        >
          <input
            aria-invalid={false}
            className="ms-TextField-field field-71"
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
    className="iconButton-55"
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
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="24"
    />
    <line
      fill="none"
      stroke="#ffffff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="24"
      x1="88"
      x2="168"
      y1="128"
      y2="128"
    />
  </svg>
</div>
`);
  });

  test('viewing', () => {
    const json = create(
      <CardExtraField
        field={cardField}
        editing={false}
      />,
    ).toJSON();
    expect(json).toMatchInlineSnapshot(`
<div
  className="ms-Stack css-56"
>
  <span
    className="viewingKey-72"
  >
    a key
  </span>
  <span
    className="viewingValue-73"
  >
    a value
  </span>
</div>
`);
  });
});
