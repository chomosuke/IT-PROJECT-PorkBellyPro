import {
  DefaultButton, IButtonProps, IIconProps, IconButton, Stack,
} from '@fluentui/react';
import PropTypes, { Requireable } from 'prop-types';
import React from 'react';
import { ITag } from '../controllers/Tag';

type OnClickHandler = IButtonProps['onClick'];

export interface ITagProps {
  tag: ITag;
  onClick?: OnClickHandler;
  onRemove?: OnClickHandler;
}

const removeIcon: IIconProps = { iconName: 'CalculatorMultiply' };

export const Tag: React.VoidFunctionComponent<ITagProps> = ({ tag, onClick, onRemove }) => {
  const tagWithXStyles = {
    root: {
      height: '20px',
      outerWidth: '50px',
      backgroundColor: tag.color,
      border: 'none',
    },
  };

  const removeBtnStyles = {
    root: {
      height: '20px',
      outerWidth: '10px',
      fontSize: '5px',
      backgroundColor: tag.color,
      border: 'none',
    },
  };

  const tagStyles = {
    root: {
      height: '20px',
      outerWidth: '60px',
      backgroundColor: tag.color,
      border: 'none',
    },
  };
  if (onRemove !== undefined) {
    // show x button if on remove is pass in
    return (
      <Stack horizontal>
        <DefaultButton
          text={tag.label}
          onClick={onClick}
          styles={tagWithXStyles}
        />
        <IconButton
          iconProps={removeIcon}
          onClick={onRemove}
          styles={removeBtnStyles}
        />
      </Stack>
    );
  }

  // otherwise only show the tag itself
  return (
    <DefaultButton
      text={tag.label}
      onClick={onClick}
      styles={tagStyles}
    />
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
