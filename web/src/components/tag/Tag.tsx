import {
  DefaultButton, IButtonProps, IIconProps, IconButton, Stack, mergeStyleSets,
} from '@fluentui/react';
import PropTypes, { Requireable } from 'prop-types';
import React from 'react';
import { ITag } from '../../controllers/Tag';

type OnClickHandler = IButtonProps['onClick'];

export interface ITagProps {
  tag: ITag;
  onClick?: OnClickHandler;
  onRemove?: OnClickHandler;
}

const getClassNames = () => mergeStyleSets({
  tagContainer: {
    height: '100%',
    outerWidth: '60px',
  },
});

const removeIcon: IIconProps = { iconName: 'CalculatorMultiply' };

export const Tag: React.VoidFunctionComponent<ITagProps> = ({ tag, onClick, onRemove }) => {
  const tagStyles = {
    root: {
      backgroundColor: tag.color,
      border: 'none',
    },
  };

  const { tagContainer } = getClassNames();

  if (onRemove != null) {
    // show x button if on remove is pass in
    return (
      <div className={tagContainer}>
        <Stack horizontal>
          <DefaultButton
            text={tag.label}
            onClick={onClick}
            styles={tagStyles}
          />
          <IconButton
            iconProps={removeIcon}
            onClick={onRemove}
            styles={tagStyles}
          />
        </Stack>
      </div>
    );
  }

  // otherwise only show the tag itself
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

Tag.defaultProps = {
  onClick: undefined,
  onRemove: undefined,
};

Tag.propTypes = {
  tag: (PropTypes.object as Requireable<ITag>).isRequired,
  onClick: PropTypes.func,
  onRemove: PropTypes.func,
};
