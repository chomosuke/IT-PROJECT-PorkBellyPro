import React from 'react';
import { create } from 'react-test-renderer';
import { TagEditor } from '../../../components/tag/TagEditor';
import { ITag } from '../../../controllers/Tag';

import '../../disable-icon-warnings.helpers';

const demoTag: ITag = {
  id: '1',
  label: 'Big Boss',
  color: '#BF7829',
  commit() { throw new Error('Not implemented'); },
  delete() { throw new Error('Not implemented'); },
};

const htmlId = 'TagAnchor';

describe('TagEditor render tests', () => {
  test('without closingFunction', () => {
    const json = create(
      <TagEditor anchor={htmlId} tag={demoTag} />,
    ).toJSON();
    expect(json).toMatchInlineSnapshot(`
<span
  className="ms-layer"
/>
`);
  });

  test('with closingFunction', () => {
    const json = create(
      <TagEditor
        anchor={htmlId}
        tag={demoTag}
        closingFunction={() => { }}
      />,
    ).toJSON();
    expect(json).toMatchInlineSnapshot(`
<span
  className="ms-layer"
/>
`);
  });
});
