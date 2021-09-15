import { Schema, Types } from 'mongoose';

export interface ICardField {
  key: string;
  value: string;
}

export interface ICard {
  user: Types.ObjectId;
  favorite: boolean;
  name: string;
  phone: string;
  email: string;
  jobTitle: string;
  company: string;
  image?: Buffer;
  imageHash?: string;
  fields: ICardField[];
  tags: Types.ObjectId[];
}

const cardFieldSchema = new Schema<ICardField>({
  key: { type: String, required: true },
  value: { type: String, required: true },
});

export const cardSchema = new Schema<ICard>({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  favorite: { type: Boolean, required: true, default: false },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  image: Buffer,
  imageHash: String,
  fields: {
    type: [cardFieldSchema],
    required: true,
    default: [],
  },
  tags: { type: [Schema.Types.ObjectId], required: true, default: [] },
});
