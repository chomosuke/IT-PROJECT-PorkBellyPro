import React from 'react';
import renderer from 'react-test-renderer';
import { RootFrame } from '../../components/RootFrame';

describe('RootFrame tests', () => {
  test('Simple render', () => {
    const Dummy: React.VoidFunctionComponent = () => <></>;

    const tree = renderer.create(
      <RootFrame>
        <Dummy />
      </RootFrame>,
    ).toJSON();

    expect(tree).toMatchInlineSnapshot('null');
  });
});
