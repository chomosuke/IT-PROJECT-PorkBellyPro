import React from 'react';
import { ICard } from '../controllers/Card';

export interface ICardDetailsProps {
  card: ICard;
  editing: boolean;
}

export const CardDetails: React.VoidFunctionComponent<ICardDetailsProps> = () => <></>;
