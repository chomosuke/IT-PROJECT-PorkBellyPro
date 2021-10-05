import {
  DefaultButton, Dialog, DialogFooter, DialogType, IButtonStyles,
  IDialogContentProps,
  IDialogFooterProps,
  IDialogProps,
  PrimaryButton, Stack,
} from '@fluentui/react';
import PropTypes from 'prop-types';
import React from 'react';
import { useTheme } from '../theme';

export interface IWarningDialogProps {
  hideDialog: boolean;
  title: string;
  subText: string;
  closeButtonStr: string;
  closeButtonOnClick: () => void;
  okButtonStr?: string;
  okButtonOnClick?: () => void;
}

export const WarningDialog: React.VoidFunctionComponent<IWarningDialogProps> = (
  {
    hideDialog,
    title,
    subText,
    closeButtonStr,
    closeButtonOnClick,
    okButtonOnClick,
    okButtonStr,
  },
) => {
  if ((okButtonOnClick == null && okButtonStr != null)
   || (okButtonOnClick != null && okButtonStr == null)) {
    throw new Error(`okButtonOnClick is ${okButtonOnClick} while okButtonStr is ${okButtonStr}.`);
  }

  const [width, height] = ['340px', '240px'];

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
      margin: '0 24px',
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
      height: '40px',
      borderRadius: '4px',
    },
  };

  const dialogStyles: IDialogProps['styles'] = {
    main: {
      width,
      height,
      backgroundColor: theme.palette.everblue,
      borderRadius: '4px',
    },
  };

  const dialogContentStyle: IDialogContentProps['styles'] = {
    content: {
      width,
      height,
      display: 'flex',
      flexDirection: 'column',
    },
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
      margin: '0',
    },
    inner: {
      flexGrow: 1,
      padding: '0, 24px',
    },
    innerContent: {
      /**
       * After failed attempt at styling it properly, this height make sure buttons are 24px
       * from the bottom.
       */
      height: '75px',
    },
  };

  const footerStyles: IDialogFooterProps['styles'] = {
    actionsRight: {
      marginRight: '0',
    },
    actions: {
      margin: '0',
    },
  };

  const contentProps: IDialogProps['dialogContentProps'] = {
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
      <DialogFooter styles={footerStyles}>
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
};

WarningDialog.defaultProps = {
  okButtonStr: undefined,
  okButtonOnClick: undefined,
};
