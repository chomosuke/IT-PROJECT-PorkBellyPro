import {
  DefaultButton, Dialog, DialogFooter, DialogType, IButtonProps, PrimaryButton,
} from '@fluentui/react';
import PropTypes from 'prop-types';
import React from 'react';

type OnClickHandler = IButtonProps['onClick'];

export interface IDialogProps {
  hideDialog: boolean | undefined;
  toggleHideDialog: () => void;
  onDelete?: OnClickHandler;
}

const cardContentProps = {
  type: DialogType.normal,
  title: 'Warning',
  closeButtonAriaLabel: 'Close',
  subText: 'Deleted cards won\'t be recoverable, are you sure you want to do that?',
};

export const DeletingCardWarning: React.VoidFunctionComponent<IDialogProps> = (
  { hideDialog, toggleHideDialog, onDelete },
) => (
  <Dialog
    hidden={hideDialog}
    onDismiss={toggleHideDialog}
    dialogContentProps={cardContentProps}
  >
    <DialogFooter>
      <PrimaryButton onClick={onDelete} text='Yes, Delete' />
      <DefaultButton onClick={toggleHideDialog} text='Close' />
    </DialogFooter>
  </Dialog>
);

DeletingCardWarning.defaultProps = {
  onDelete: undefined,
};

DeletingCardWarning.propTypes = {
  hideDialog: PropTypes.bool.isRequired,
  toggleHideDialog: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};
