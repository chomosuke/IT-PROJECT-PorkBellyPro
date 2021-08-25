import {
  IButtonStyles, Icon, PrimaryButton, makeStyles,
} from '@fluentui/react';
import React from 'react';
import { RootFrame } from './components/RootFrame';

const getClassName = makeStyles({
  divStyles: {
    display: 'flex',
  },
  iconStyles: {
    marginLeft: '12px',
  },
});

const buttonStyles: IButtonStyles = {
  root: {
    margin: 'auto',
  },
};

export const App: React.VoidFunctionComponent = function App() {
  const { divStyles, iconStyles } = getClassName();
  return (
    <RootFrame>
      <div className={divStyles}>
        <PrimaryButton styles={buttonStyles}>
          Hello world!
          <Icon iconName='Album' className={iconStyles} />
        </PrimaryButton>
      </div>
    </RootFrame>
  );
};
