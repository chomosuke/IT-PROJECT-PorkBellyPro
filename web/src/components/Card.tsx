import React from 'react';
import PropTypes from 'prop-types';
import { DefaultButton, mergeStyleSets } from '@fluentui/react';
import { ICard } from '../controllers/Card';
import { useApp } from '../AppContext';

export interface ICardProps {
  card: ICard;
}

// styles
const getClassName = () => mergeStyleSets({
  root: {
    margin: '3rem',
    color: 'white',
    background: 'limegreen',
  },
});

export const Card: React.VoidFunctionComponent<ICardProps> = ({ card }) => {
  const {
    id, name, phone, jobTitle,
  } = card;
  const { root } = getClassName();
  const { showCardDetail } = useApp();

  // const { currentCard, expandCardDetail } = useHome()!;

  /*
   * const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
   *   e.preventDefault;
   *   const cardId = id;
   *   expandCardDetail(cardId!);
   *   console.log(cardId);
   * }
   */

  const handleOnClick = () => {
    console.log('button clicked');
    showCardDetail(card);
  };

  return (
    <div className={root}>

      <div>{id}</div>
      <div>{name}</div>
      <div>{phone}</div>
      <div>{jobTitle}</div>

      <DefaultButton onClick={handleOnClick}>
        select this
      </DefaultButton>

    </div>
  );
};

Card.propTypes = {
  card: PropTypes.object as React.Validator<ICard> | undefined,
};

Card.defaultProps = {
  card: undefined,
};
