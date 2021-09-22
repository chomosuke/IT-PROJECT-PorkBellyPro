import {
  Callout, ICalloutProps,
} from '@fluentui/react';
import PropTypes, { Requireable } from 'prop-types';
import React from 'react';
import { ITag } from '../controllers/Tag';

// closing Function is called to dismiss callout
export interface ITagEditorProps {
  tag: ITag;
  anchor: ICalloutProps['target'];
  closingFunction?: () => void;
}

export const TagEditor: React.VoidFunctionComponent<ITagEditorProps> = ({
  tag, anchor, closingFunction,
}) => (
  <Callout
    target={anchor}
    onDismiss={() => { if (closingFunction) closingFunction(); }}
  >
    <span>
      Calling edit for
      {tag.id}
    </span>
  </Callout>
);

TagEditor.propTypes = {
  tag: (PropTypes.object as Requireable<ITag>).isRequired,
  anchor: (PropTypes.object as Requireable<ICalloutProps['target']>).isRequired,
  closingFunction: PropTypes.func,
};

TagEditor.defaultProps = {
  closingFunction: () => { },
};
