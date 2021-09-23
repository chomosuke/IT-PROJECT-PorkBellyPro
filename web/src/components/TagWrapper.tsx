import { DefaultButton } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { Requireable, useState } from 'react';
import PropType from 'prop-types';
import { ICard } from '../controllers/Card';
import { ITag } from '../controllers/Tag';
import { Tag } from './Tag';
import { TagEditor } from './TagEditor';

export interface ITagWrapperProps {
  tag: ITag;
  card?: ICard;
}

export const TagWrapper: React.VoidFunctionComponent<ITagWrapperProps> = ({
  tag, card,
}) => {
  const targetElemId = useId();
  const [editorOpen, setEditorOpen] = useState(false);

  const attachTag = () => {
    if (card && !card.tags.includes(tag)) {
      card.update({ tags: [...card.tags, tag] });
    }
  };

  return (
    <div id={targetElemId}>
      <Tag tag={tag} onClick={attachTag} />
      <DefaultButton
        text='Edit Tag'
        onClick={() => setEditorOpen(true)}
      />
      {editorOpen
      && (
      <TagEditor
        anchor={`#${targetElemId}`}
        tag={tag}
        closingFunction={() => setEditorOpen(false)}
      />
      )}
    </div>

  );
};

TagWrapper.propTypes = {
  tag: (PropType.object as Requireable<ITag>).isRequired,
  card: (PropType.object as Requireable<ICard>),
};

TagWrapper.defaultProps = {
  card: undefined,
};
