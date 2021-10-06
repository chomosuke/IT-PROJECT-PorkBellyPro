import {
  ITextFieldProps, Text, TextField, mergeStyleSets,
} from '@fluentui/react';
import { Requireable, bool, object } from 'prop-types';
import React from 'react';
import { ICardField } from '../../controllers/CardField';
import { Theme, useTheme } from '../../theme';

export interface ICardNoteFieldProps {
  field: ICardField;
  editing: boolean;
}

const getClassNames = (theme: Theme) => mergeStyleSets({
  valueViewing: {
    ...theme.shape.shortShadow,
    backgroundColor: theme.palette.justWhite,
    minHeight: '80px',
    padding: '16px',
    marginBottom: '40px',
  },
  valueViewingText: {
    ...theme.fontFamily.roboto,
    ...theme.fontSize.standard,
    whiteSpace: 'pre-wrap',
    width: '100%',
    overflowWrap: 'break-word',
    overflow: 'hidden',
  },
});

const textStyle = {
  lineHeight: '28px',
  verticalAlign: 'middle',
};

const getValueEditingStyles: (theme: Theme) => ITextFieldProps['styles'] = (theme) => ({
  field: {
    ...theme.fontFamily.roboto,
    ...theme.fontSize.standard,
    color: theme.palette.deepSlate,
    ...textStyle,
  },
  fieldGroup: {
    minHeight: '80px',
    padding: '16px',
    ...theme.shape.shortShadow,
    marginBottom: '40px',
  },
});

export const CardNoteField: React.VoidFunctionComponent<ICardNoteFieldProps> = (
  { field, editing },
) => {
  const theme = useTheme();

  const { valueViewing, valueViewingText } = getClassNames(theme);

  const valueEditingStyles = getValueEditingStyles(theme);

  return (editing
    ? (
      <TextField
        styles={valueEditingStyles}
        multiline
        autoAdjustHeight
        borderless
        resizable={false}
        value={field.value}
        onChange={(e, nValue) => {
          field.update({ value: nValue });
        }}
      />
    )
    : (
      <div className={valueViewing}>
        <Text className={valueViewingText}>{field.value}</Text>
      </div>
    )
  );
};

CardNoteField.propTypes = {
  field: (object as Requireable<ICardField>).isRequired,
  editing: bool.isRequired,
};
