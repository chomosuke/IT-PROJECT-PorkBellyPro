import { IButtonProps } from '@fluentui/react';
import PropTypes, { Requireable } from 'prop-types';
import React from 'react';
import { ITag } from '../controllers/Tag';

type OnClickHandler = IButtonProps['onClick'];

export interface ITagButtonProps {
  tag: ITag;
  onClick?: OnClickHandler;
}

export const TagButton: React.VoidFunctionComponent<ITagButtonProps> = () => null;

TagButton.propTypes = {
  tag: (PropTypes.object as Requireable<ITag>).isRequired,
  onClick: PropTypes.func,
};
