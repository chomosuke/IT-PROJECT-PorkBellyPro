import { Stack, Text, TextField } from '@fluentui/react';
import PropTypes, { Requireable, bool, func } from 'prop-types';
import React from 'react';

export interface ICardMandatoryFieldProps {
  field: { key: string; value: string };
  editing: boolean;
  onEdit: (value: string) => void;
}

export const CardMandatoryField: React.VoidFunctionComponent<ICardMandatoryFieldProps> = ({
  field, editing, onEdit,
}) => {
  const { key, value } = field;
  return (
    <Stack horizontal>
      <Stack.Item grow key='key'>
        <Text>{key}</Text>
      </Stack.Item>
      <Stack.Item grow key='value'>
        {editing
          ? (
            <TextField
              value={value}
              onChange={(e, nValue) => {
                if (nValue !== undefined) onEdit(nValue);
              }}
            />
          )
          : <Text>{value}</Text>}
      </Stack.Item>
    </Stack>
  );
};

CardMandatoryField.propTypes = {
  field: (PropTypes.object as Requireable<{ key: string; value: string }>).isRequired,
  editing: bool.isRequired,
  onEdit: func.isRequired,
};
