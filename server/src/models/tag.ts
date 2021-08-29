import { Schema, Types } from 'mongoose';

export interface ITag {
  user: Types.ObjectId;
  label: string;
  color: string;
}

export const tagSchema = new Schema<ITag>({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  label: String,
  color: String,
});
