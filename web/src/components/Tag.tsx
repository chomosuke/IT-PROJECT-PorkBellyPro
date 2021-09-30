/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import { mergeStyleSets } from '@fluentui/react';
import PropTypes, { Requireable } from 'prop-types';
import React from 'react';
import { ITag } from '../controllers/Tag';
import { useTheme } from '../theme';

type OnClickHandler = React.DOMAttributes<HTMLSpanElement>['onClick'];

export interface ITagProps {
  tag: ITag;
  onClick?: OnClickHandler;
  onRemove?: OnClickHandler;
}

const getClassNames = (tagColor: string, hasClick: boolean, hasRemove: boolean) => {
  const {
    fontFamily: { roboto },
    fontSize: { small },
    fontWeight: { medium },
    palette: { justWhite },
  } = useTheme(); // eslint-disable-line react-hooks/rules-of-hooks

  const rootOptionalStyles: { cursor?: string } = {};
  if (hasClick) {
    rootOptionalStyles.cursor = 'pointer';
  }

  const rightSpanOptionalStyles: { cursor?: string } = {};
  if (hasRemove) {
    rightSpanOptionalStyles.cursor = 'pointer';
  }

  return mergeStyleSets({
    root: {
      backgroundColor: tagColor,
      borderRadius: '8px',
      display: 'flex',
      height: '24px',
      ...rootOptionalStyles,
    },
    labelSpan: {
      ...roboto,
      ...small,
      ...medium,
      color: justWhite,
      marginBottom: 'auto',
      marginLeft: '32px',
      marginTop: 'auto',
      userSelect: 'none',
    },
    rightSpan: {
      display: 'flex',
      width: '32px',
      ...rightSpanOptionalStyles,
    },
    crossIcon: {
      height: '16px',
      margin: 'auto',
      width: '16px',
    },
  });
};

export const Tag: React.VoidFunctionComponent<ITagProps> = ({ tag, onClick, onRemove }) => {
  const {
    icon: { cross: Cross },
    palette: { justWhite },
  } = useTheme();

  const {
    root,
    labelSpan,
    rightSpan,
    crossIcon,
  } = getClassNames(tag.color, Boolean(onClick), Boolean(onRemove));

  return (
    <div className={root}>
      <span className={labelSpan} onClick={onClick}>{tag.label}</span>
      <span className={rightSpan} onClick={onRemove}>
        {onRemove && <Cross className={crossIcon} color={justWhite} />}
      </span>
    </div>
  );
};

Tag.defaultProps = {
  onClick: undefined,
  onRemove: undefined,
};

Tag.propTypes = {
  tag: (PropTypes.object as Requireable<ITag>).isRequired,
  onClick: PropTypes.func,
  onRemove: PropTypes.func,
};
