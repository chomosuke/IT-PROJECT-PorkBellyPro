import {
  DefaultButton, Dialog, DialogFooter, DialogType, IButtonProps, IButtonStyles,
  IDialogContentProps, PrimaryButton, Stack,
} from '@fluentui/react';
import PropTypes from 'prop-types';
import React from 'react';
import { useTheme } from '../theme';

  type OnClickHandler = IButtonProps['onClick'];

export const dialogType = {
  LOGIN_REGISTER: 0,
  DELETE_CARD: 1,
  DELETE_TAG: 2,
};

export interface IDialogProps {
  hideDialog: boolean | undefined;
  toggleHideDialog: () => void;
  type: number;
  registering?: boolean;
  onDelete?: OnClickHandler;
  newCard?: boolean;
}

export const WarningDialog: React.VoidFunctionComponent<IDialogProps> = (
  {
    hideDialog, toggleHideDialog, type, registering, onDelete, newCard,
  },
) => {
  const theme = useTheme();

  const primaryBtnStyles:IButtonStyles = {
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
      margin: '0 12px',
      height: '40px',
      borderRadius: '4px',
    },
  };

  const secondaryBtnStyles:IButtonStyles = {
    root: {
      ...theme.fontFamily.roboto,
      ...theme.fontSize.small,
      ...theme.fontWeight.bold,
      backgroundColor: theme.palette.everblue,
      color: theme.palette.justWhite,
      borderStyle: 'solid',
      borderWidth: '2px',
      borderColor: theme.palette.justWhite,
      whiteSpace: 'nowrap',
      padding: '0 24px',
      margin: '0 12px',
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

  const cardContentProps:IDialogContentProps = {
    type: DialogType.normal,
    title: 'Warning',
    closeButtonAriaLabel: 'Close',
    subText: 'Deleted cards won\'t be recoverable, are you sure you want to do that?',
    styles: dialogContentStyle,
  };

  const newCardContentProps:IDialogContentProps = {
    type: DialogType.normal,
    title: 'Warning',
    closeButtonAriaLabel: 'Close',
    subText: 'Information discarded won\'t be recoverable, '
    + 'are you sure you want to discard adding a new card?',
    styles: dialogContentStyle,
  };

  const tagContentProps = {
    type: DialogType.normal,
    title: 'Warning',
    closeButtonAriaLabel: 'Close',
    subText: 'Deleted tags won\'t be recoverable, are you sure you want to do that?',
    styles: dialogContentStyle,
  };

  if (type === dialogType.LOGIN_REGISTER) {
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
            <DefaultButton styles={primaryBtnStyles} onClick={toggleHideDialog} text='Close' />
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
          <DefaultButton styles={primaryBtnStyles} onClick={toggleHideDialog} text='Close' />
        </DialogFooter>
      </Dialog>
    );
  }
  if (type === dialogType.DELETE_CARD) {
    if (newCard) {
      // case 3: deleting a new card
      return (
        <Dialog
          hidden={hideDialog}
          onDismiss={toggleHideDialog}
          dialogContentProps={newCardContentProps}
          styles={dialogStyles}
        >
          <DialogFooter>
            <Stack horizontal horizontalAlign='end'>
              <PrimaryButton styles={primaryBtnStyles} onClick={onDelete} text='Yes, Discard' />
              <DefaultButton styles={secondaryBtnStyles} onClick={toggleHideDialog} text='Cancel' />
            </Stack>
          </DialogFooter>
        </Dialog>
      );
    }

    // case 4: deleting an existing card
    return (
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={cardContentProps}
        styles={dialogStyles}
      >
        <DialogFooter>
          <Stack horizontal horizontalAlign='end'>
            <PrimaryButton styles={primaryBtnStyles} onClick={onDelete} text='Yes, Delete' />
            <DefaultButton styles={secondaryBtnStyles} onClick={toggleHideDialog} text='Cancel' />
          </Stack>
        </DialogFooter>
      </Dialog>
    );
  }

  // case 5: deleting a tag
  return (
    <Dialog
      hidden={hideDialog}
      onDismiss={toggleHideDialog}
      dialogContentProps={tagContentProps}
      styles={dialogStyles}
    >
      <DialogFooter>
        <Stack horizontal horizontalAlign='end'>
          <PrimaryButton styles={primaryBtnStyles} onClick={onDelete} text='Yes, Delete' />
          <DefaultButton styles={secondaryBtnStyles} onClick={toggleHideDialog} text='Cancel' />
        </Stack>
      </DialogFooter>
    </Dialog>
  );
};

WarningDialog.defaultProps = {
  registering: false,
  onDelete: undefined,
  newCard: false,
};

WarningDialog.propTypes = {
  hideDialog: PropTypes.bool.isRequired,
  toggleHideDialog: PropTypes.func.isRequired,
  type: PropTypes.number.isRequired,
  registering: PropTypes.bool,
  onDelete: PropTypes.func,
  newCard: PropTypes.bool,
};
