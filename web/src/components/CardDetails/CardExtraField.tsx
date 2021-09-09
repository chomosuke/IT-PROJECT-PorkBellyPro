import { Stack, Text, TextField } from '@fluentui/react';
import { Requireable, bool, object } from 'prop-types';
import React from 'react';
import { ICardField } from '../../controllers/CardField';

export interface ICardExtraFieldProps {
  field: ICardField;
  editing: boolean;
}

export const CardExtraField: React.VoidFunctionComponent<ICardExtraFieldProps> = (
  { field, editing },
) => {
  const { key, value } = field;
  return (
    <Stack horizontal>
      <Stack.Item grow key='key'>
        {editing
          ? (
            <TextField
              value={key}
              onChange={(e, nValue) => {
                field.update({ key: nValue });
              }}
            />
          )
          : <Text>{key}</Text>}
      </Stack.Item>
      <Stack.Item grow key='value'>
        {editing
          ? (
            <TextField
              value={value}
              onChange={(e, nValue) => {
                field.update({ value: nValue });
              }}
            />
          )
          : <Text>{value}</Text>}
      </Stack.Item>
    </Stack>
  );
};

CardExtraField.propTypes = {
  field: (object as Requireable<ICardField>).isRequired,
  editing: bool.isRequired,
};
