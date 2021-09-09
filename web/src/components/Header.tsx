import { Stack } from '@fluentui/react';
import React from 'react';
import { useApp } from '../AppContext';
import { Logo } from './Logo';
import { UserButton } from './UserButton';
import { SearchBox } from './SearchBox';

export const Header: React.VoidFunctionComponent = () => {
  const { user } = useApp();
  return (
    <Stack horizontal horizontalAlign='center'>
      <Logo />
      {user != null
        && (
        <Stack.Item grow>
          <SearchBox />
        </Stack.Item>
        )}
      {user != null
        && <UserButton />}
    </Stack>
  );
};
