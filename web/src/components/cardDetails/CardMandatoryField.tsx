import {
  ITextFieldProps, Stack, Text, TextField, mergeStyleSets,
} from '@fluentui/react';
import PropTypes, { Requireable, bool, func } from 'prop-types';
import React from 'react';
import { Theme, useTheme } from '../../theme';

export interface ICardMandatoryFieldProps {
  field: { key: string; value: string };
  editing: boolean;
  onEdit: (value: string) => void;
}

const textStyle = {
  height: '36px',
  lineHeight: '36px',
  verticalAlign: 'middle',
};

const getClassNames = (theme: Theme) => mergeStyleSets({
  viewingKey: {
    ...theme.fontFamily.roboto,
    ...theme.fontSize.standard,
    ...theme.fontWeight.medium,
    color: theme.palette.justWhite,
    width: '120px',
    maxWidth: '120px',
    marginRight: '20px',
    ...textStyle,
  },
  viewingValue: {
    ...theme.fontFamily.roboto,
    ...theme.fontSize.standard,
    ...theme.fontWeight.light,
    color: theme.palette.justWhite,
    ...textStyle,
  },
});

const getEditingValueStyle: (theme: Theme) => ITextFieldProps['styles'] = (theme: Theme) => ({
  root: {
    ...theme.shape.default,
  },
  field: {
    ...theme.fontFamily.roboto,
    ...theme.fontSize.standard,
    ...theme.fontWeight.light,
    color: theme.palette.deepSlate,
    ...textStyle,
  },
  fieldGroup: {
    ...textStyle,
    borderRadius: theme.shape.default.borderRadius,
  },
});

export const CardMandatoryField: React.VoidFunctionComponent<ICardMandatoryFieldProps> = ({
  field, editing, onEdit,
}) => {
  const theme = useTheme();
  const { key, value } = field;
  if (value === '' && !editing) {
    return <></>;
  }
  const { viewingKey, viewingValue } = getClassNames(theme);
  const editingValueStyle = getEditingValueStyle(theme);
  return (
    <Stack horizontal>
      <Text className={viewingKey}>{key}</Text>
      {editing
        ? (
          <TextField
            styles={editingValueStyle}
            borderless
            value={value}
            onChange={(e, nValue) => {
              if (nValue !== undefined) onEdit(nValue);
            }}
          />
        )
        : <Text className={viewingValue}>{value}</Text>}
    </Stack>
  );
};

CardMandatoryField.propTypes = {
  field: (PropTypes.object as Requireable<{ key: string; value: string }>).isRequired,
  editing: bool.isRequired,
  onEdit: func.isRequired,
};
