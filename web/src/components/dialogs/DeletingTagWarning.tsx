import {
  DefaultButton, Dialog, DialogFooter, DialogType, IButtonProps,
  IButtonStyles, PrimaryButton, Stack,
} from '@fluentui/react';
import PropTypes from 'prop-types';
import React from 'react';
import { useTheme } from '../../theme';

type OnClickHandler = IButtonProps['onClick'];

export interface IDialogProps {
  hideDialog: boolean | undefined;
  toggleHideDialog: () => void;
  onDelete?: OnClickHandler;
}

export const DeletingTagWarning: React.VoidFunctionComponent<IDialogProps> = (
  { hideDialog, toggleHideDialog, onDelete },
) => {
  const theme = useTheme();

  const yesBtnStyles:IButtonStyles = {
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

  const closeBtnStyles:IButtonStyles = {
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
  };

  const tagContentProps = {
    type: DialogType.normal,
    title: 'Warning',
    closeButtonAriaLabel: 'Close',
    subText: 'Deleted tags won\'t be recoverable, are you sure you want to do that?',
    styles: dialogContentStyle,
  };

  return (
    <Dialog
      hidden={hideDialog}
      onDismiss={toggleHideDialog}
      dialogContentProps={tagContentProps}
      styles={dialogStyles}
    >
      <DialogFooter>
        <Stack horizontal horizontalAlign='end'>
          <PrimaryButton styles={yesBtnStyles} onClick={onDelete} text='Yes, Delete' />
          <DefaultButton styles={closeBtnStyles} onClick={toggleHideDialog} text='Cancel' />
        </Stack>
      </DialogFooter>
    </Dialog>
  );
};

DeletingTagWarning.defaultProps = {
  onDelete: undefined,
};

DeletingTagWarning.propTypes = {
  hideDialog: PropTypes.bool.isRequired,
  toggleHideDialog: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};
