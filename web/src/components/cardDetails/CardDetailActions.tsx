import { DefaultButton, Stack } from '@fluentui/react';
import {
  bool, func,
} from 'prop-types';
import React from 'react';
import { useBoolean } from '@fluentui/react-hooks';
import { useHome } from '../../HomeContext';
import { WarningDialog, dialogType } from '../warningDialog';

export interface ICardDetailActionsProps {
  editing: boolean;
  onBeginEdit(): void;
  onSave(): void;
  onCancel(): void;
  onDelete(): void;
}

export const CardDetailActions: React.VoidFunctionComponent<ICardDetailActionsProps> = (
  {
    editing, onBeginEdit, onSave, onCancel, onDelete,
  },
) => {
  const home = useHome();
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);

  if (home === undefined) {
    return <></>;
  }

  const { cardDetailExpanded, expandCardDetail } = home;

  return (
    <Stack horizontal horizontalAlign='end'>
      <WarningDialog
        hideDialog={hideDialog}
        toggleHideDialog={toggleHideDialog}
        type={dialogType.DELETE_CARD}
        onDelete={onDelete}
      />
      <Stack.Item key='expand'>
        <DefaultButton text={cardDetailExpanded ? 'collapse' : 'expand'} onClick={() => expandCardDetail(!cardDetailExpanded)} />
      </Stack.Item>
      { editing
        ? (
          <>
            <Stack.Item key='save'>
              <DefaultButton text='save' onClick={onSave} />
            </Stack.Item>
            <Stack.Item key='cancel'>
              <DefaultButton text='cancel' onClick={onCancel} />
            </Stack.Item>
          </>
        )
        : (
          <Stack.Item key='edit'>
            <DefaultButton text='edit' onClick={onBeginEdit} />
          </Stack.Item>
        )}
      <Stack.Item key='delete'>
        <DefaultButton text='delete' onClick={toggleHideDialog} />
      </Stack.Item>
    </Stack>
  );
};

CardDetailActions.propTypes = {
  editing: bool.isRequired,
  onBeginEdit: func.isRequired,
  onSave: func.isRequired,
  onCancel: func.isRequired,
  onDelete: func.isRequired,
};
