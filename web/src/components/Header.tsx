import { DefaultButton, Stack } from '@fluentui/react';
import React from 'react';
import { useApp } from '../AppContext';
import { Logo } from './Logo';
import { UserButton } from './UserButton';
import { SearchBox } from './SearchBox';

export const Header: React.VoidFunctionComponent = () => {
  const { user, newCard } = useApp();
  return (
    <Stack horizontal horizontalAlign='center'>
      <Logo />
      {user != null
        && (
        <>
          <Stack.Item grow>
            <SearchBox />
          </Stack.Item>
          <DefaultButton
            iconProps={{ iconName: 'Add' }}
            text='New card'
            onClick={() => { newCard(); }}
          />
          <UserButton />
        </>
        )}
    </Stack>
  );
};
