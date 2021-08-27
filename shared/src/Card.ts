import { CardField } from './CardField';
import { ObjectId } from './ObjectId';

export interface Card {
  id: ObjectId;
  favorite: boolean;
  name: string;
  phone: string;
  email: string;
  jobTitle: string;
  company: string;
  hasImage: boolean;
  fields: CardField[];
  tags: ObjectId[];
}
