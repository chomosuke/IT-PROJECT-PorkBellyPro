import React from 'react';
import { ICard } from '../controllers/Card';

export interface ICardDetailActionsProps {
  card: ICard;
  editing: boolean;
  onBeginEdit(): void;
  onSave(): void;
  onCancel(): void;
}

export const CardDetailActions: React.VoidFunctionComponent<ICardDetailActionsProps> = () => <></>;
