import {
  DefaultButton, Dialog, DialogFooter, DialogType, IButtonStyles,
} from '@fluentui/react';
import PropTypes from 'prop-types';
import React from 'react';
import { useTheme } from '../../theme';

export interface IDialogProps {
  hideDialog: boolean | undefined;
  toggleHideDialog: () => void;
  registering?: boolean;
}

export const LoginAndRegisterError: React.VoidFunctionComponent<IDialogProps> = (
  { hideDialog, toggleHideDialog, registering },
) => {
  const theme = useTheme();

  const closeBtnStyles:IButtonStyles = {
    root: {
      ...theme.fontFamily.roboto,
      ...theme.fontSize.small,
      ...theme.fontWeight.bold,
      backgroundColor: theme.palette.justWhite,
      color: theme.palette.everblue,
      borderStyle: 'solid',
      borderWidth: '2px',
      borderColor: theme.palette.justWhite,
      whiteSpace: 'nowrap',
      padding: '0 24px',
      height: '40px',
      borderRadius: '4px',
    },
  };

  const dialogStyles = {
    main: {
      width: '340px',
      backgroundColor: theme.palette.everblue,
      borderRadius: '4px',
    },

  };

  const dialogContentStyle = {
    title: {
      ...theme.fontFamily.roboto,
      ...theme.fontSize.standard,
      ...theme.fontWeight.bold,
      color: theme.palette.justWhite,
      padding: '24px',
    },
    subText: {
      ...theme.fontFamily.roboto,
      ...theme.fontSize.small,
      ...theme.fontWeight.light,
      color: theme.palette.justWhite,
    },
    inner: {
      display: 'flex',
      justifyItems: 'space-between',
      flexDirection: 'column',
      padding: '0px 24px 24px 24px',
    },
    innerContent: {
      paddingBottom: '50px',
    },
  };

  const registerationContentProps = {
    type: DialogType.normal,
    title: 'Error',
    closeButtonAriaLabel: 'Close',
    subText: 'Your Username has already been taken',
    styles: dialogContentStyle,
  };

  const loginContentProps = {
    type: DialogType.normal,
    title: 'Error',
    closeButtonAriaLabel: 'Close',
    subText: 'Incorrect username or password',
    styles: dialogContentStyle,
  };

  // case 1: registeration failure
  if (registering) {
    return (
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={registerationContentProps}
        styles={dialogStyles}
      >
        <DialogFooter>
          <DefaultButton styles={closeBtnStyles} onClick={toggleHideDialog} text='Close' />
        </DialogFooter>
      </Dialog>
    );
  }

  // case 2: login failure
  return (
    <Dialog
      hidden={hideDialog}
      onDismiss={toggleHideDialog}
      dialogContentProps={loginContentProps}
      styles={dialogStyles}
    >
      <DialogFooter>
        <DefaultButton styles={closeBtnStyles} onClick={toggleHideDialog} text='Close' />
      </DialogFooter>
    </Dialog>
  );
};

LoginAndRegisterError.defaultProps = {
  registering: false,
};

LoginAndRegisterError.propTypes = {
  hideDialog: PropTypes.bool.isRequired,
  toggleHideDialog: PropTypes.func.isRequired,
  registering: PropTypes.bool,
};
