import {
  mergeStyleSets,
} from '@fluentui/react';
import React from 'react';
import { useTheme } from '../../theme';

const getClassNames = () => {
  const {
    fontFamily: { roboto },
    fontWeight: { black },
    palette: { justWhite },
  } = useTheme(); // eslint-disable-line react-hooks/rules-of-hooks

  return mergeStyleSets({
    root: {
      ...roboto,
      ...black,
      alignContent: 'center',
      color: justWhite,
      display: 'grid',
      fontSize: '28px',
      height: '100%',
      paddingLeft: '12px',
      paddingRight: '12px',
      userSelect: 'none',
    },
  });
};

export const Logo: React.VoidFunctionComponent = () => {
  const {
    root,
  } = getClassNames();

  return (
    <div className={root}>
      PorkBelly
    </div>
  );
};
