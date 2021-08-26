import { Schema } from 'mongoose';

export interface ITag {
  label: string;
  color: string;
}

export const tagSchema = new Schema<ITag>({
  label: String,
  color: String,
});
