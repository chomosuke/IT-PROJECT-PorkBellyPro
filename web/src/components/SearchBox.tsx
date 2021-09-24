import { Stack, TextField } from '@fluentui/react';
import React from 'react';
import { useApp } from '../AppContext';
import { ITag } from '../controllers/Tag';
import { Tag } from './Tag';

export const SearchBox: React.VoidFunctionComponent = () => {
  const context = useApp();

  const handleChange = (
    _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined,
  ): void => {
    context.update({
      searchQuery: newValue,
    });
  };

  const removeTagFromQuery = (tag:ITag) => (
    context.tagQuery.filter((elem) => elem !== tag)
  );

  return (
    <Stack horizontal>
      <div>
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
      </div>
      <TextField
        placeholder='Search'
        value={context.searchQuery}
        onChange={handleChange}
      />
    </Stack>
  );
};
