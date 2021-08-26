import { Document, ObjectId } from 'mongoose';
import { ApiRequestHandler } from './api-router';
import { IUser } from '../models/user';
import { ICardField } from '../models/card';

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

type CardPutResponse = Card;

// type CardPatchRequest = Pick<Card, 'id'> & Partial<Omit<Card, 'id'>>;

// dummy type to assist in accessing user.
type RequestWithUser<Type> = Type & { user: IUser & Document };

export const createCard: ApiRequestHandler = async function createCard(
  _req: { body: RequestWithUser<CardPutRequest> }, res,
) {
  // create card
  const newCard = new this.Cards({
    name: _req.body.name,
    phone: _req.body.phone,
    email: _req.body.email,
    jobTitle: _req.body.jobTitle,
    company: _req.body.company,
    fields: _req.body.fields,
    tags: _req.body.tags,
  });

  // assuming that the user exists
  const { user } = _req.body;
  user.cards.push(newCard);
  await user.save((error) => {
    if (error) {
      res.status(500).send('Internal Error');
      console.log(error);
    } else {
      const replyBody : CardPutResponse = {
        id: newCard.id,
        favorite: newCard.favorite,
        name: newCard.name,
        phone: newCard.phone,
        email: newCard.email,
        jobTitle: newCard.jobTitle,
        company: newCard.company,
        fields: newCard.fields,
        tags: newCard.tags,
      };

      res.status(201).json(replyBody);
    }
  });
};

export const updateCard: ApiRequestHandler = function updateCard(_req, res) {
  // TODO: accept api
  res.send('Cards updated');
};

export const deleteCard: ApiRequestHandler = async function deleteCard(
  _req: { body: RequestWithUser<CardDeleteRequest> }, res,
) {
  res.send('Card deleted');
};
