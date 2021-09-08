import React from 'react';
import PropTypes from 'prop-types';
import { ICard } from '../controllers/Card';

export interface ICardProps {
  card: ICard;
}

export const Card: React.VoidFunctionComponent<ICardProps> = ({ card }) => {
  const { name, phone } = card;

  return (
    <div>
      <div>{name}</div>
      <div>{phone}</div>
    </div>
  );
};

Card.propTypes = {
  card: PropTypes.object as React.Validator<ICard> | undefined,
};

Card.defaultProps = {
  card: undefined,
};
