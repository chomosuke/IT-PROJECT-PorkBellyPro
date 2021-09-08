import { DefaultButton, IContextualMenuProps } from '@fluentui/react';
import React from 'react';
import { useApp } from '../AppContext';

export const LogoutBtn: React.VoidFunctionComponent = () => {
  const context = useApp();

  const handleLogout = async () => {
    await context.logout();
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
        // icon go here
      },
    ],
  };

  if (context.user !== null) {
    return (
      <DefaultButton
        text='Menu'
        split
        menuProps={menuProps}
      />
    );
  }

  return (
    <></>
  );
};
