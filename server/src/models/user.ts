import { Schema } from 'mongoose';

export interface IUser {
  username: string;
  password: string;
}

export const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
});
