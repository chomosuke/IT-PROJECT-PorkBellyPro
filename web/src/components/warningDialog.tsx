import {
  DefaultButton, Dialog, DialogFooter, DialogType, IButtonStyles,
  PrimaryButton, Stack,
} from '@fluentui/react';
import PropTypes from 'prop-types';
import React from 'react';
import { useTheme } from '../theme';

export interface IDialogProps {
  hideDialog: boolean;
  title: string;
  subText: string;
  closeButtonStr: string;
  closeButtonOnClick: () => void;
  okButtonStr?: string;
  okButtonOnClick?: () => void;
  width: string | number;
  height: string | number;
}

export const WarningDialog: React.VoidFunctionComponent<IDialogProps> = (
  {
    hideDialog,
    title,
    subText,
    closeButtonStr,
    closeButtonOnClick,
    okButtonOnClick,
    okButtonStr,
    width,
    height,
  },
) => {
  if ((okButtonOnClick == null && okButtonStr != null)
   || (okButtonOnClick != null && okButtonStr == null)) {
    throw new Error(`okButtonOnClick is ${okButtonOnClick} while okButtonStr is ${okButtonStr}.`);
  }

  const theme = useTheme();

  const primaryBtnStyles: IButtonStyles = {
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

  const secondaryBtnStyles: IButtonStyles = {
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
      width,
      height,
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

  const contentProps = {
    type: DialogType.normal,
    title,
    subText,
    styles: dialogContentStyle,
  };

  return (
    <Dialog
      hidden={hideDialog}
      onDismiss={closeButtonOnClick}
      dialogContentProps={contentProps}
      styles={dialogStyles}
    >
      <DialogFooter>
        <Stack horizontal horizontalAlign='end'>
          {okButtonStr != null
            && (
            <PrimaryButton
              styles={primaryBtnStyles}
              onClick={okButtonOnClick}
              text={okButtonStr}
            />
            )}
          <DefaultButton
            styles={secondaryBtnStyles}
            onClick={closeButtonOnClick}
            text={closeButtonStr}
          />
        </Stack>
      </DialogFooter>
    </Dialog>
  );
};

WarningDialog.propTypes = {
  hideDialog: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  subText: PropTypes.string.isRequired,
  closeButtonStr: PropTypes.string.isRequired,
  closeButtonOnClick: PropTypes.func.isRequired,
  okButtonStr: PropTypes.string,
  okButtonOnClick: PropTypes.func,
  width: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number,
  ]).isRequired,
  height: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number,
  ]).isRequired,
};

WarningDialog.defaultProps = {
  okButtonStr: undefined,
  okButtonOnClick: undefined,
};
