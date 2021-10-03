import React from 'react';
import { create } from 'react-test-renderer';
import { TagWrapper } from '../../components/tagSelector/TagWrapper';
import { ICard } from '../../controllers/Card';
import { ITag } from '../../controllers/Tag';

import '../disable-icon-warnings.helpers';

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
  id="id__0"
>
  <div
    className="root-53"
  >
    <span
      className="labelSpan-54"
      onClick={[Function]}
    >
      Big Boss
    </span>
    <span
      className="rightSpan-55"
    />
  </div>
  <button
    className="ms-Button ms-Button--default root-57"
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
      className="ms-Button-flexContainer flexContainer-58"
      data-automationid="splitbuttonprimary"
    >
      <span
        className="ms-Button-textContainer textContainer-59"
      >
        <span
          className="ms-Button-label label-61"
          id="id__1"
        >
          Edit Tag
        </span>
      </span>
    </span>
  </button>
</div>
`);
  });

  test('without edit button', () => {
    const json = create(
      <TagWrapper tag={demoTag} />,
    ).toJSON();
    expect(json).toMatchInlineSnapshot(`
<div
  id="id__4"
>
  <div
    className="root-53"
  >
    <span
      className="labelSpan-54"
      onClick={[Function]}
    >
      Big Boss
    </span>
    <span
      className="rightSpan-55"
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
  id="id__5"
>
  <div
    className="root-53"
  >
    <span
      className="labelSpan-54"
      onClick={[Function]}
    >
      Big Boss
    </span>
    <span
      className="rightSpan-55"
    />
  </div>
  <button
    className="ms-Button ms-Button--default root-57"
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
      className="ms-Button-flexContainer flexContainer-58"
      data-automationid="splitbuttonprimary"
    >
      <span
        className="ms-Button-textContainer textContainer-59"
      >
        <span
          className="ms-Button-label label-61"
          id="id__6"
        >
          Edit Tag
        </span>
      </span>
    </span>
  </button>
</div>
`);
  });
});