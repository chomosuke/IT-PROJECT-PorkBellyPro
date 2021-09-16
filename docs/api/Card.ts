import type { CardField } from './CardField';
import { Hashed } from './Hashed';
import type { ObjectId } from './ObjectId';

export interface Card {
  id: ObjectId;
  favorite: boolean;
  name: string;
  phone: string;
  email: string;
  jobTitle: string;
  company: string;
  imageHash?: Hashed;
  fields: CardField[];
  tags: ObjectId[];
}
