import { IButtonProps } from '@fluentui/react';
import PropTypes, { Requireable } from 'prop-types';
import React from 'react';
import { ITag } from '../controllers/Tag';

type OnClickHandler = IButtonProps['onClick'];

export interface ITagProps {
  tag: ITag;
  onClick?: OnClickHandler;
  onRemove?: OnClickHandler;
}

export const Tag: React.VoidFunctionComponent<ITagProps> = () => null;

Tag.propTypes = {
  tag: (PropTypes.object as Requireable<ITag>).isRequired,
  onClick: PropTypes.func,
  onRemove: PropTypes.func,
};
