import { Document, ObjectId } from 'mongoose';
import { IUser } from '../models/user';
import { ICard, ICardField } from '../models/card';
import { ApiRequestHandler } from './api-router';

/*
 * test interface to allow user information to be passed
 * ADAPTED FROM docs/api/card.md
 */
type CardField = ICardField;

interface Card {
  id: ObjectId;
  favorite: boolean;
  name: string;
  phone: string;
  email: string;
  jobTitle: string;
  company: string;
  fields: CardField[];
  tags: ObjectId[];
}

interface CardDeleteRequest {
  id: ObjectId;
}

type CardPutRequest = Omit<Card, 'id' | 'favorite'>;

// type CardPutResponse = Card;

// type CardPatchResponse = Card;

type CardPatchRequest = Pick<Card, 'id'> & Partial<Omit<Card, 'id'>>;

// dummy type to assist in accessing user.
type RequestWithUser<Type> = Type & { user: IUser & Document };

function createCardResponse(card: ICard & Document): Card {
  return {
    id: card.id,
    favorite: card.favorite,
    name: card.name,
    phone: card.phone,
    email: card.email,
    jobTitle: card.jobTitle,
    company: card.company,
    fields: card.fields,
    tags: card.tags,
  };
}

export const createCard: ApiRequestHandler = async function createCard(
  _req: { body: RequestWithUser<CardPutRequest> }, res,
) {
  /*
   * create card
   * because I put in userDocument with the body, there's a need to split
   */
  const { user, ...details } = _req.body;
  const newCard = new this.Cards(details);

  // assuming that the user exists
  user.cards.push(newCard);
  user.save((error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send('Saved incorrectly');
    } else {
      const card = result.cards.at(-1);
      if (card?.equals(newCard)) {
        const cardResponse = createCardResponse(card);
        res.status(201).json(cardResponse);
      } else {
        // card is not saved or incorrect?
        res.status(500).send('Failed to save correctly');
      }
    }
  });
};

export const updateCard: ApiRequestHandler = async function updateCard(
  _req: { body: RequestWithUser<CardPatchRequest> }, res,
) {
  // fetch the card from the user
  const { id, user, ...newDetails } = _req.body;
  // assuming user exists
  const index = user.cards.findIndex((card) => card.id === id);
  if (index === -1) {
    res.status(404).send('Resource not found');
  } else {
    const cardCopy = Object.assign(user.cards[index], newDetails);
    user.save((error, result) => {
      if (error) {
        console.log(error);
        res.status(500).send('Internal Error');
      } else {
        const card = result.cards.at(index);
        if (card?.equals(cardCopy)) {
          const cardResponse = createCardResponse(card);
          res.status(200).json(cardResponse);
        } else {
          // card at the index is not the same
          res.status(500).send('Failed to save correctly');
        }
      }
    });
  }
};

export const deleteCard: ApiRequestHandler = async function deleteCard(
  _req: { body: RequestWithUser<CardDeleteRequest> }, res,
) {
  const { id, user } = _req.body;
  const index = user.cards.findIndex((card) => card.id === id);
  if (index === -1) {
    res.status(410).send('Card does not exist');
  } else {
    user.cards.splice(index, 1);
    user.save((error, result) => {
      if (error) {
        console.log(error);
        res.status(500).send('Internal Error');
      } else if (result.cards.find((card) => card.id === id)) {
        // card still exists!
        res.status(500).send('Failed to delete card');
      } else {
        res.status(204).end();
      }
    });
  }
};
