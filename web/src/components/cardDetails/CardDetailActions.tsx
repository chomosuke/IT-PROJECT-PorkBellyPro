import {
  IStackTokens, Stack, mergeStyleSets,
} from '@fluentui/react';
import {
  bool, func,
} from 'prop-types';
import React from 'react';
import { useBoolean } from '@fluentui/react-hooks';
import { useHome } from '../../HomeContext';
import { WarningDialog } from '../warningDialog';
import { useTheme } from '../../theme';

export interface ICardDetailActionsProps {
  editing: boolean;
  newCard: boolean;
  onBeginEdit(): void;
  onSave(): void;
  onCancel(): void;
  onDelete(): void;
}

const getClassNames = () => mergeStyleSets({
  iconButton: {
    cursor: 'pointer',
  },
});

const stackTokensRoot: IStackTokens = {
  childrenGap: '48px',
  padding: '36px 48px 48px 48px',
};

const stackTokensRight: IStackTokens = {
  childrenGap: '48px',
};

export const CardDetailActions: React.VoidFunctionComponent<ICardDetailActionsProps> = (
  {
    editing, newCard, onBeginEdit, onSave, onCancel, onDelete,
  },
) => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const { cardDetailExpanded, expandCardDetail } = useHome();

  const theme = useTheme();

  const { iconButton } = getClassNames();

  // id for acceptance test
  return (
    <>
      <WarningDialog
        hideDialog={hideDialog}
        closeButtonOnClick={toggleHideDialog}
        closeButtonStr='Cancel'
        okButtonOnClick={newCard ? onCancel : onDelete}
        okButtonStr={newCard ? 'Yes, Discard' : 'Yes, Delete'}
        title='Warning'
        subText={newCard
          ? 'Information discarded won\'t be recoverable, are you sure you want to '
           + 'discard adding a new card?'
          : 'Deleted cards won\'t be recoverable, are you sure you want to do that?'}
      />
      <Stack horizontal horizontalAlign='space-between' tokens={stackTokensRoot}>
        {cardDetailExpanded
          ? (
            <theme.icon.caretDoubleRight
              id='collapseButton'
              className={iconButton}
              color={theme.palette.justWhite}
              size={32}
              onClick={() => expandCardDetail(!cardDetailExpanded)}
            />
          )
          : (
            <theme.icon.caretDoubleLeft
              id='expandButton'
              className={iconButton}
              color={theme.palette.justWhite}
              size={32}
              onClick={() => expandCardDetail(!cardDetailExpanded)}
            />
          )}
        <Stack horizontal tokens={stackTokensRight}>
          { editing
            ? (
              <>
                <theme.icon.tick
                  id='saveButton'
                  className={iconButton}
                  color={theme.palette.justWhite}
                  size={32}
                  onClick={onSave}
                />
                {!newCard
              && (
              <theme.icon.cross
                id='cancelButton'
                className={iconButton}
                color={theme.palette.justWhite}
                size={32}
                onClick={onCancel}
              />
              )}
              </>
            )
            : (
              <theme.icon.pencilLine
                id='editButton'
                className={iconButton}
                color={theme.palette.justWhite}
                size={32}
                onClick={onBeginEdit}
              />
            )}
          <theme.icon.trash
            id='deleteButton'
            className={iconButton}
            color={theme.palette.justWhite}
            size={32}
            onClick={toggleHideDialog}
          />
        </Stack>
      </Stack>
    </>
  );
};

CardDetailActions.propTypes = {
  editing: bool.isRequired,
  newCard: bool.isRequired,
  onBeginEdit: func.isRequired,
  onSave: func.isRequired,
  onCancel: func.isRequired,
  onDelete: func.isRequired,
};
