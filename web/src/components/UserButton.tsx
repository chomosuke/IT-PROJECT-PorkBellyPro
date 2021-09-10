import { DefaultButton, IContextualMenuProps } from '@fluentui/react';
import React from 'react';
import { useApp } from '../AppContext';

export const UserButton: React.VoidFunctionComponent = () => {
  const app = useApp();
  const { user } = app;

  const handleLogout = async () => {
    await app.logout();
    /*
     * const res = await context.logout();
     * check respond
     * if (!res.ok) {
     *   alert(`logout failed error:${res.status} ${res.statusText}`);
     * }
     */
  };

  const logoutClick = () => {
    handleLogout();
    return false;
  };

  const menuProps: IContextualMenuProps = {
    items: [
      {
        key: 'logout',
        text: 'Logout',
        onClick: logoutClick,
        iconProps: { iconName: 'SignOut' },
      },
    ],
  };

  if (user !== null) {
    return (
      <DefaultButton
        text={user.username}
        iconProps={{ iconName: 'Contact' }}
        menuProps={menuProps}
      />
    );
  }

  return (
    <></>
  );
};
