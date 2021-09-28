import {
  DefaultButton, Dialog, DialogFooter, DialogType,
} from '@fluentui/react';
import PropTypes from 'prop-types';
import React from 'react';

export interface IDialogProps {
  hideDialog: boolean | undefined;
  toggleHideDialog: () => void;
  registering?: boolean;
}

const registerationContentProps = {
  type: DialogType.normal,
  title: 'Error',
  closeButtonAriaLabel: 'Close',
  subText: 'Your Username has already been taken',
};

const loginContentProps = {
  type: DialogType.normal,
  title: 'Error',
  closeButtonAriaLabel: 'Close',
  subText: 'Incorrect username or password',
};

export const LoginAndRegisterError: React.VoidFunctionComponent<IDialogProps> = (
  { hideDialog, toggleHideDialog, registering },
) => {
  // case 1: registeration failure
  if (registering) {
    return (
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={registerationContentProps}
      >
        <DialogFooter>
          <DefaultButton onClick={toggleHideDialog} text='Close' />
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
    >
      <DialogFooter>
        <DefaultButton onClick={toggleHideDialog} text='Close' />
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
