import { DefaultButton, IButtonProps, mergeStyleSets } from '@fluentui/react';
import PropTypes, { Requireable } from 'prop-types';
import React from 'react';
import { ITag } from '../controllers/Tag';

type OnClickHandler = IButtonProps['onClick'];

export interface ITagButtonProps {
  tag: ITag;
  onClick?: OnClickHandler;
}

const getClassNames = () => mergeStyleSets({
  tagContainer: {
    height: '100%',
    outerWidth: '60px',
  },
});

export const TagButton: React.VoidFunctionComponent<ITagButtonProps> = ({ tag, onClick }) => {
  const tagStyles = {
    root: {
      backgroundColor: tag.color,
      border: 'none',
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
