import { DefaultButton, IButtonProps, mergeStyleSets } from '@fluentui/react';
import PropTypes, { Requireable } from 'prop-types';
import React from 'react';
import { ITag } from '../controllers/Tag';
import { useTheme } from '../theme';

type OnClickHandler = IButtonProps['onClick'];

export interface ITagButtonProps {
  tag: ITag;
  onClick?: OnClickHandler;
}

const getClassNames = () => mergeStyleSets({
  tagContainer: {
  },
});

export const TagButton: React.VoidFunctionComponent<ITagButtonProps> = ({ tag, onClick }) => {
  const theme = useTheme();
  const tagStyles = {
    root: {
      backgroundColor: tag.color,
      border: 'none',
      padding: '0 32px',
      margin: '0 12px',
      height: '32px',
      borderRadius: '4px',
      ...theme.fontFamily.roboto,
      ...theme.fontSize.small,
      color: theme.palette.justWhite,
    },
  };

  const { tagContainer } = getClassNames();

  return (
    <div className={tagContainer}>
      <DefaultButton
        text={tag.label}
        onClick={onClick}
        styles={tagStyles}
      />
    </div>
  );
};

TagButton.defaultProps = {
  onClick: undefined,
};

TagButton.propTypes = {
  tag: (PropTypes.object as Requireable<ITag>).isRequired,
  onClick: PropTypes.func,
};
