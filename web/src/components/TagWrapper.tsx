import { DefaultButton } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { Requireable } from 'react';
import PropType from 'prop-types';
import { ICard } from '../controllers/Card';
import { ITag } from '../controllers/Tag';
import { Tag } from './Tag';

export interface ITagWrapperProps {
  tag: ITag;
  card?: ICard;
  setTagEdit?: (id: string) => void;
}

export const TagWrapper: React.VoidFunctionComponent<ITagWrapperProps> = ({
  tag, card, setTagEdit,
}) => {
  const targetElemId = useId();

  const attachTag = () => {
    if (card && !card.tags.includes(tag)) {
      card.update({ tags: [...card.tags, tag] });
    }
  };

  return (
    <div id={targetElemId}>
      <Tag tag={tag} onClick={attachTag} />
      {setTagEdit
        && (
        <DefaultButton
          text='Edit Tag'
          onClick={() => setTagEdit(targetElemId)}
        />
        )}
    </div>

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
