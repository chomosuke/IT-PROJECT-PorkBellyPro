import { ObjectId } from './ObjectId';

export interface Tag {
  id: ObjectId;
  label: string;
  color: string;
}
