import React from 'react';
import { create } from 'react-test-renderer';
import { TagWrapper } from '../../../components/tag/TagWrapper';
import { ICard } from '../../../controllers/Card';
import { ITag } from '../../../controllers/Tag';

import '../../disable-icon-warnings.helpers';

const demoTag: ITag = {
  id: '1',
  label: 'Big Boss',
  color: '#BF7829',
  commit() { throw new Error('Not implemented'); },
  delete() { throw new Error('Not implemented'); },
};

const demoCard: ICard = {
  company: 'None',
  tags: [],
  email: 'noEmail@jmail.com',
  favorite: false,
  fields: [],
  jobTitle: 'Unemployed',
  name: 'no name',
  phone: '0001',
  update() { throw new Error('Not Implemented'); },
  commit() { throw new Error('Not implemented'); },
  delete() { throw new Error('Not implemented'); },
};

describe('TagWrapper Render Tests', () => {
  test('with edit button', () => {
    const json = create(
      <TagWrapper
        tag={demoTag}
        setTagEdit={() => { }}
      />,
    ).toJSON();
    expect(json).toMatchInlineSnapshot(`
<div
  className="ms-Stack css-54"
  id="id__0"
>
  <div
    className="root-55"
  >
    <span
      className="labelSpan-56"
      onClick={[Function]}
    >
      Big Boss
    </span>
    <span
      className="rightSpan-57"
    />
  </div>
  <svg
    className="iconButton-53"
    fill="#ffffff"
    height={24}
    onClick={[Function]}
    viewBox="0 0 256 256"
    width={24}
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
      r="16"
    />
    <circle
      cx="64"
      cy="128"
      r="16"
    />
    <circle
      cx="192"
      cy="128"
      r="16"
    />
  </svg>
</div>
`);
  });

  test('without edit button', () => {
    const json = create(
      <TagWrapper tag={demoTag} />,
    ).toJSON();
    expect(json).toMatchInlineSnapshot(`
<div
  className="ms-Stack css-54"
  id="id__1"
>
  <div
    className="root-55"
  >
    <span
      className="labelSpan-56"
      onClick={[Function]}
    >
      Big Boss
    </span>
    <span
      className="rightSpan-57"
    />
  </div>
</div>
`);
  });

  test('with attached card, with edit button', () => {
    const json = create(
      <TagWrapper
        tag={demoTag}
        card={demoCard}
        setTagEdit={() => { }}
      />,
    ).toJSON();
    expect(json).toMatchInlineSnapshot(`
<div
  className="ms-Stack css-54"
  id="id__2"
>
  <div
    className="root-55"
  >
    <span
      className="labelSpan-56"
      onClick={[Function]}
    >
      Big Boss
    </span>
    <span
      className="rightSpan-57"
    />
  </div>
  <svg
    className="iconButton-53"
    fill="#ffffff"
    height={24}
    onClick={[Function]}
    viewBox="0 0 256 256"
    width={24}
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
      r="16"
    />
    <circle
      cx="64"
      cy="128"
      r="16"
    />
    <circle
      cx="192"
      cy="128"
      r="16"
    />
  </svg>
</div>
`);
  });
});
