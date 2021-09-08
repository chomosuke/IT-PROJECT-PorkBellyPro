import React from 'react';
import { useApp } from '../AppContext';
import { LogoutBtn } from './LogoutBtn';
import { SearchBox } from './SearchBox';

export const Header: React.VoidFunctionComponent = () => {
  const { user } = useApp();
  if (user !== null) {
    return (
      <div>
        Hello
        {user.username}
        <SearchBox />
        <LogoutBtn />
      </div>
    );
  }

  return (
    <div>
      PorkBelly
    </div>
  );
};
