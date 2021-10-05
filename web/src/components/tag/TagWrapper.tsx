import { Stack, mergeStyleSets } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { Requireable } from 'react';
import PropType from 'prop-types';
import { ICard } from '../../controllers/Card';
import { ITag } from '../../controllers/Tag';
import { Tag } from './Tag';
import { useTheme } from '../../theme';

export interface ITagWrapperProps {
  tag: ITag;
  card?: ICard;
  setTagEdit?: (id: string) => void;
}

const getClassName = () => mergeStyleSets({
  iconButton: {
    cursor: 'pointer',
    marginRight: '8px',
  },
});

export const TagWrapper: React.VoidFunctionComponent<ITagWrapperProps> = ({
  tag, card, setTagEdit,
}) => {
  const theme = useTheme();
  const targetElemId = useId();

  const { iconButton } = getClassName();

  const attachTag = () => {
    if (card && !card.tags.includes(tag)) {
      card.update({ tags: [...card.tags, tag] });
    }
  };

  return (
    <Stack horizontal id={targetElemId} horizontalAlign='space-between'>
      <Tag tag={tag} onClick={attachTag} />
      {setTagEdit
        && (
          <theme.icon.dotsThree
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
  tag: (PropType.object as Requireable<ITag>).isRequired,
  card: (PropType.object as Requireable<ICard>),
  setTagEdit: PropType.func,
};

TagWrapper.defaultProps = {
  card: undefined,
  setTagEdit: undefined,
};
