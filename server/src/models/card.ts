import { ObjectId, Schema } from 'mongoose';

export interface ICardField {
  key: string;
  value: string;
}

export interface ICard {
  favorite: boolean;
  name: string;
  phone: string;
  email: string;
  jobTitle: string;
  company: string;
  image?: Buffer;
  fields: ICardField[];
  tags: ObjectId[];
}

export const cardSchema = new Schema<ICard>({
  favorite: { type: Boolean, require: true, default: false },
  name: { type: String, require: true },
  phone: { type: String, require: true },
  email: { type: String, require: true },
  jobTitle: { type: String, require: true },
  company: { type: String, require: true },
  image: Buffer,
  fields: {
    type: [new Schema<ICardField>({
      key: { type: String, require: true },
      value: { type: String, require: true },
    })],
    require: true,
    default: [],
  },
  tags: { type: [Schema.Types.ObjectId], require: true, default: [] },
});
