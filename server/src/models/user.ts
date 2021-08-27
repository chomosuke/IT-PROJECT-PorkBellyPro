import { Document, Schema } from 'mongoose';
import { ITag, tagSchema } from './tag';
import { ICard, cardSchema } from './card';

export interface IUser {
  username: string;
  password: string;
  cards: (ICard & Document<ICard>)[];
  tags: (ITag & Document<ITag>)[];
}

export const userSchema = new Schema<IUser>({
  username: { type: String, require: true },
  password: { type: String, require: true },
  cards: { type: [cardSchema], require: true, default: [] },
  tags: { type: [tagSchema], require: true, default: [] },
});
