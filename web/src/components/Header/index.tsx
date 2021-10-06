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
      // gridTemplateColumns: 'minmax(0,calc(50% - 324px)) auto minmax(0,calc(50% - 324px))',
      gridTemplateColumns: '1fr 2fr 1fr',
      height: '48px',
      whiteSpace: 'nowrap',
    },
    left: {
      gridArea: 'left',
      margin: '0 24px',
    },
    mid: {
      alignContent: 'center',
      display: 'grid',
      gridArea: 'mid',
    },
    right: {
      display: 'flex',
      columnGap: '16px',
      gridArea: 'right',
      justifyContent: 'end',
      margin: '0 24px',
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
