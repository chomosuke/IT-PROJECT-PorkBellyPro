import { mergeStyleSets } from '@fluentui/react';
import React from 'react';
import { useApp } from '../../AppContext';
import { useTheme } from '../../theme';
import { IIconButtonDropdownOption, IconButton } from './IconButton';
import { Logo } from './Logo';
import { SearchBox } from './SearchBox';

const getClassNames = () => {
  const {
    palette: { everblue },
  } = useTheme(); // eslint-disable-line react-hooks/rules-of-hooks

  return mergeStyleSets({
    root: {
      backgroundColor: everblue,
      display: 'grid',
      gridTemplateAreas: '"left mid right"',
      gridTemplateColumns: 'minmax(0,calc(50% - 324px)) auto minmax(0,calc(50% - 324px))',
      height: '48px',
      whiteSpace: 'nowrap',
    },
    left: {
      gridArea: 'left',
      marginLeft: '14px',
    },
    mid: {
      alignContent: 'center',
      display: 'grid',
      gridArea: 'mid',
      marginLeft: '14px',
      marginRight: '14px',
    },
    right: {
      display: 'flex',
      columnGap: '28px',
      gridArea: 'right',
      justifyContent: 'end',
      marginRight: '14px',
    },
  });
};

export const Header: React.VoidFunctionComponent = () => {
  const { user, newCard, logout } = useApp();
  const {
    icon: { plusCircle, signOut, userCircle },
  } = useTheme();

  const {
    root,
    left,
    mid,
    right,
  } = getClassNames();

  const addCardOnClick = () => {
    newCard();
  };

  const dropdownOptions: IIconButtonDropdownOption[] = [
    {
      label: 'Log out',
      icon: signOut,
      onClick: () => { logout(); },
    },
  ];

  if (user == null) {
    return (
      <div className={root}>
        <div className={mid}>
          <Logo center />
        </div>
      </div>
    );
  }

  return (
    <div className={root}>
      <div className={left}>
        <Logo />
      </div>
      <div className={mid}>
        <SearchBox />
      </div>
      <div className={right}>
        <IconButton label='Add card' icon={plusCircle} onClick={addCardOnClick} />
        <IconButton label={user.username} icon={userCircle} dropdown={dropdownOptions} />
      </div>
    </div>
  );
};