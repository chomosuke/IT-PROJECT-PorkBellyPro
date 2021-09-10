import { DefaultButton, Stack } from '@fluentui/react';
import {
  Requireable, bool, func, object,
} from 'prop-types';
import React from 'react';
import { ICard } from '../../controllers/Card';
import { useHome } from '../../HomeContext';

export interface ICardDetailActionsProps {
  card: ICard;
  editing: boolean;
  onBeginEdit(): void;
  onSave(): void;
  onCancel(): void;
}

export const CardDetailActions: React.VoidFunctionComponent<ICardDetailActionsProps> = (
  {
    card, editing, onBeginEdit, onSave, onCancel,
  },
) => {
  const home = useHome();

  if (home === undefined) {
    return <></>;
  }

  const { cardDetailExpanded, expandCardDetail } = home;

  return (
    <Stack horizontal horizontalAlign='end'>
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
        <DefaultButton text='delete' onClick={card.delete} />
      </Stack.Item>
    </Stack>
  );
};

CardDetailActions.propTypes = {
  card: (object as Requireable<ICard>).isRequired,
  editing: bool.isRequired,
  onBeginEdit: func.isRequired,
  onSave: func.isRequired,
  onCancel: func.isRequired,
};
