import { DefaultButton, IButtonProps } from '@fluentui/react';
import PropTypes, { Requireable } from 'prop-types';
import React from 'react';
import { ITag } from '../controllers/Tag';

type OnClickHandler = IButtonProps['onClick'];

export interface ITagButtonProps {
  tag: ITag;
  onClick?: OnClickHandler;
}

export const TagButton: React.VoidFunctionComponent<ITagButtonProps> = ({ tag, onClick }) => {
  const tagStyles = {
    root: {
      height: '40px',
      outerWidth: '60px',
      backgroundColor: tag.color,
      border: 'none',
    },
  };

  return (
    <DefaultButton
      text={tag.label}
      onClick={onClick}
      styles={tagStyles}
    />
  );
};

TagButton.defaultProps = {
  onClick: undefined,
};

TagButton.propTypes = {
  tag: (PropTypes.object as Requireable<ITag>).isRequired,
  onClick: PropTypes.func,
};
