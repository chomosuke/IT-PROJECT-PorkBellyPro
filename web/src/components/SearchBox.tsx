import { TextField } from '@fluentui/react';
import React from 'react';
import { useApp } from '../AppContext';

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

  return (
    <TextField
      placeholder='Search'
      value={context.searchQuery}
      onChange={handleChange}
    />
  );
};
