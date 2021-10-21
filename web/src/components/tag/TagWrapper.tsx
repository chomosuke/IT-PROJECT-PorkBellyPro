import { Stack, keyframes, mergeStyleSets } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { Requireable } from 'react';
import PropTypes from 'prop-types';
import { ICard } from '../../controllers/Card';
import { ITag } from '../../controllers/Tag';
import { Tag } from './Tag';
import { Theme, useTheme } from '../../theme';

export interface ITagWrapperProps {
  tag: ITag;
  card?: ICard;
  maxWidth?: number;
  setTagEdit?: (id: string) => void;
}

const getClassName = (theme: Theme) => {
  const hoverHighlight = keyframes({
    from: {
      background: theme.palette.stoneBlue,
    },
    to: {
      background: theme.palette.moldyCheese,
    },
  });

  return mergeStyleSets({
    root: {
      padding: '4px',
      borderRadius: '8px',
      '&:hover': {
        animationName: hoverHighlight,
        animationDuration: '0.2s',
        animationFillMode: 'forwards',
      },
    },
    iconButton: {
      cursor: 'pointer',
      marginRight: '8px',
    },
  });
};

export const TagWrapper: React.VoidFunctionComponent<ITagWrapperProps> = ({
  tag, card, maxWidth, setTagEdit,
}) => {
  const theme = useTheme();
  const targetElemId = useId();

  const { root, iconButton } = getClassName(theme);

  const attachTag = () => {
    if (card && !card.tags.includes(tag)) {
      card.update({ tags: [...card.tags, tag] });
    }
  };

  return (
    <Stack horizontal id={targetElemId} horizontalAlign='space-between' className={root}>
      <Tag
        tag={tag}
        maxWidth={maxWidth == null ? undefined : maxWidth - 36}
        onClick={attachTag}
      />
      {setTagEdit
        && (
          <theme.icon.dotsThree
            id='editTagButton'
            className={iconButton}
            size={24}
            color={theme.palette.justWhite}
            onClick={() => setTagEdit(targetElemId)}
          />
        )}
    </Stack>
  );
};

TagWrapper.propTypes = {
  tag: (PropTypes.object as Requireable<ITag>).isRequired,
  card: (PropTypes.object as Requireable<ICard>),
  maxWidth: PropTypes.number,
  setTagEdit: PropTypes.func,
};

TagWrapper.defaultProps = {
  card: undefined,
  maxWidth: undefined,
  setTagEdit: undefined,
};
