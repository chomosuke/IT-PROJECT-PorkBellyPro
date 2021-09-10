import {
  Stack, Text, TextField, mergeStyleSets,
} from '@fluentui/react';
import { Requireable, bool, object } from 'prop-types';
import React from 'react';
import { ICardField } from '../../controllers/CardField';

export interface ICardNoteFieldProps {
  field: ICardField;
  editing: boolean;
}

const getClassNames = () => mergeStyleSets({
  value: {
    borderStyle: 'solid',
  },
});

export const CardNoteField: React.VoidFunctionComponent<ICardNoteFieldProps> = (
  { field, editing },
) => {
  const { value } = getClassNames();
  return (
    <Stack>
      <Stack.Item align='stretch'>
        <Text>{field.key}</Text>
      </Stack.Item>
      <Stack.Item align='stretch'>
        {editing
          ? (
            <TextField
              multiline
              rows={3}
              resizable={false}
              value={field.value}
              onChange={(e, nValue) => {
                field.update({ value: nValue });
              }}
            />
          )
          : (
            <div className={value}>
              <Text>{field.value}</Text>
            </div>
          )}
      </Stack.Item>
    </Stack>
  );
};

CardNoteField.propTypes = {
  field: (object as Requireable<ICardField>).isRequired,
  editing: bool.isRequired,
};
