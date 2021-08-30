import { ObjectId } from '@porkbellypro/crm-shared';
import { ICardField } from './CardField';

export interface ICardProperties {
  favorite: boolean;
  name: string;
  phone: string;
  email: string;
  jobTitle: string;
  company: string;
  image: Buffer | null;
  fields: readonly ICardField[];
}

export interface ICard extends Readonly<ICardProperties> {
  readonly id?: ObjectId;
  update(props: Partial<ICardProperties>): void;
  commit(): void;
  delete(): void;
}

export function newCard(): ICard {
  throw new Error('Not implemented');
}
