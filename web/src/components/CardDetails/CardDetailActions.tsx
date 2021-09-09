import { DefaultButton, Stack } from '@fluentui/react';
import {
  bool, func,
} from 'prop-types';
import React from 'react';
import { ICard } from '../../controllers/Card';

export interface ICardDetailActionsProps {
  card: ICard;
  editing: boolean;
  onBeginEdit(): void;
  onSave(): void;
  onCancel(): void;
}

export const CardDetailActions: React.VoidFunctionComponent<ICardDetailActionsProps> = (
  {
    editing, onBeginEdit, onSave, onCancel,
  },
) => (
  <Stack horizontal horizontalAlign='end'>
    { editing
      ? (
        <>
          <Stack.Item>
            <DefaultButton text='save' onClick={onSave} />
          </Stack.Item>
          <Stack.Item>
            <DefaultButton text='cancel' onClick={onCancel} />
          </Stack.Item>
        </>
      )
      : (
        <Stack.Item>
          <DefaultButton text='edit' onClick={onBeginEdit} />
        </Stack.Item>
      )}
  </Stack>
);

CardDetailActions.propTypes = {
  // card: (object as Requireable<ICard>).isRequired,
  editing: bool.isRequired,
  onBeginEdit: func.isRequired,
  onSave: func.isRequired,
  onCancel: func.isRequired,
};
