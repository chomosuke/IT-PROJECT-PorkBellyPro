import {
  DefaultButton, Stack, TextField, mergeStyleSets,
} from '@fluentui/react';
import React from 'react';
import { useApp } from '../AppContext';
import { ITag } from '../controllers/Tag';
import { Tag } from './tag/Tag';

const getClassNames = () => mergeStyleSets({
  searchBoxWrap: {
    border: 'solid',
  },
  clearButton: {
    border: 'none',
  },
});

export const SearchBox: React.VoidFunctionComponent = () => {
  const context = useApp();

  const { searchBoxWrap, clearButton } = getClassNames();

  const clearTagButton = () => {
    if (context.tagQuery.length === 0) {
      return (null);
    }

    return (
      <DefaultButton
        className={clearButton}
        text='clear tags'
        onClick={() => {
          context.update({
            tagQuery: [],
          });
        }}
      />
    );
  };

  const handleChange = (
    _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined,
  ): void => {
    context.update({
      searchQuery: newValue,
    });
  };

  const removeTagFromQuery = (tag: ITag) => (
    context.tagQuery.filter((elem) => elem !== tag)
  );

  return (
    <Stack horizontal className={searchBoxWrap}>
      {clearTagButton()}
      {context.tagQuery.map((tag) => (
        <Tag
          key={tag.id}
          tag={tag}
          onRemove={() => {
            context.update({
              tagQuery: removeTagFromQuery(tag),
            });
          }}
        />
      ))}
      <TextField
        placeholder='Search'
        value={context.searchQuery}
        onChange={handleChange}
        borderless
      />
    </Stack>
  );
};
