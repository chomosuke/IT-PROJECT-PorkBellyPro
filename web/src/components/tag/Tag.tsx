import {
  mergeStyleSets,
} from '@fluentui/react';
import PropTypes, { Requireable } from 'prop-types';
import React from 'react';
import { ITag } from '../../controllers/Tag';
import { Theme, useTheme } from '../../theme';

export interface ITagProps {
  tag: ITag;
  onClick?: () => void;
  onRemove?: () => void;
}

const getClassNames = (
  theme: Theme, canClick: boolean, color: string,
) => mergeStyleSets({
  tagContainer: {
    position: 'relative',
  },
  button: {
    ...(canClick ? { cursor: 'pointer' } : {}),
    lineHeight: '24px',
    verticalAlign: 'middle',
    backgroundColor: color,
    border: 'none',
    borderRadius: '8px',
    paddingLeft: '32px',
    paddingRight: '32px',
    whiteSpace: 'pre-wrap',
    ...theme.fontFamily.roboto,
    ...theme.fontSize.small,
    ...theme.fontWeight.medium,
    color: theme.palette.justWhite,
  },
  cross: {
    cursor: 'pointer',
    position: 'absolute',
    top: '4px',
    right: '8px',
  },
});

export const Tag: React.VoidFunctionComponent<ITagProps> = ({ tag, onClick, onRemove }) => {
  const theme = useTheme();

  const { tagContainer, button, cross } = getClassNames(theme, onClick != null, tag.color);

  // otherwise only show the tag itself
  return (
    <div className={tagContainer}>
      <button
        type='button'
        className={button}
        onClick={onClick}
      >
        {tag.label}
      </button>
      {onRemove != null
        && (
        <theme.icon.cross
          className={cross}
          color={theme.palette.justWhite}
          size={16}
          onClick={onRemove}
        />
        )}
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
