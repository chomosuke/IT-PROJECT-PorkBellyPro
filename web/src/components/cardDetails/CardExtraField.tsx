import {
  ITextFieldProps, Stack, Text, TextField, mergeStyleSets,
} from '@fluentui/react';
import { Requireable, bool, object } from 'prop-types';
import React from 'react';
import { ICardField } from '../../controllers/CardField';
import { Theme, useTheme } from '../../theme';

export interface ICardExtraFieldProps {
  field: ICardField;
  editing: boolean;
}

const textStyle = {
  lineHeight: '36px',
  verticalAlign: 'middle',
};

const getClassNames = (theme: Theme) => mergeStyleSets({
  viewingKey: {
    ...theme.fontFamily.roboto,
    ...theme.fontSize.standard,
    ...theme.fontWeight.medium,
    color: theme.palette.justWhite,
    minWidth: '120px',
    maxWidth: '120px',
    marginRight: '20px',
    ...textStyle,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
    overflow: 'hidden',
  },
  viewingValue: {
    ...theme.fontFamily.roboto,
    ...theme.fontSize.standard,
    ...theme.fontWeight.light,
    color: theme.palette.justWhite,
    ...textStyle,
    minWidth: '120px',
    maxWidth: '129px',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
    overflow: 'hidden',
  },
  iconButton: {
    cursor: 'pointer',
  },
});

const getEditingValueStyles: (theme: Theme) => ITextFieldProps['styles'] = (theme: Theme) => ({
  field: {
    ...theme.fontFamily.roboto,
    ...theme.fontSize.standard,
    ...theme.fontWeight.light,
    color: theme.palette.deepSlate,
    ...textStyle,
    whiteSpace: 'pre-wrap',
  },
  fieldGroup: {
    ...textStyle,
    borderRadius: theme.shape.default.borderRadius,
    marginRight: '20px',
    height: '100%',
  },
});

const getEditingKeyStyles: (theme: Theme) => ITextFieldProps['styles'] = (theme: Theme) => ({
  field: {
    ...theme.fontFamily.roboto,
    ...theme.fontSize.standard,
    ...theme.fontWeight.medium,
    color: theme.palette.deepSlate,
    ...textStyle,
    whiteSpace: 'pre-wrap',
  },
  fieldGroup: {
    ...textStyle,
    minWidth: '120px',
    maxWidth: '120px',
    marginRight: '20px',
    borderRadius: theme.shape.default.borderRadius,
    height: '100%',
  },
});

export const CardExtraField: React.VoidFunctionComponent<ICardExtraFieldProps> = (
  { field, editing },
) => {
  const { key, value } = field;

  const theme = useTheme();

  const { viewingKey, viewingValue, iconButton } = getClassNames(theme);
  const editingKeyStyles = getEditingKeyStyles(theme);
  const editingValueStyles = getEditingValueStyles(theme);

  return (
    <Stack horizontal>
      {editing
        ? (
          <TextField
            styles={editingKeyStyles}
            borderless
            value={key}
            onChange={(e, nValue) => {
              field.update({ key: nValue });
            }}
          />
        )
        : <Text className={viewingKey}>{key}</Text>}
      {editing
        ? (
          <Stack.Item grow>
            <TextField
              styles={editingValueStyles}
              borderless
              value={value}
              onChange={(e, nValue) => {
                field.update({ value: nValue });
              }}
            />
          </Stack.Item>
        )
        : <Text className={viewingValue}>{value}</Text>}
      <div />
      {editing
        && (
        <theme.icon.minusCircle
          className={iconButton}
          color={theme.palette.justWhite}
          size={36}
          onClick={() => {
            field.remove();
          }}
        />
        )}
    </Stack>
  );
};

CardExtraField.propTypes = {
  field: (object as Requireable<ICardField>).isRequired,
  editing: bool.isRequired,
};
