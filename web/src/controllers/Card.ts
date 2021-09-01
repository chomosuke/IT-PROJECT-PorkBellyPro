import { ObjectId } from '@porkbellypro/crm-shared';
import { ICardField } from './CardField';

interface ICardPropertiesCommon {
  favorite: boolean;
  name: string;
  phone: string;
  email: string;
  jobTitle: string;
  company: string;
  fields: readonly ICardField[];
}

export interface ICardProperties extends ICardPropertiesCommon {
  image: Buffer | null;
}

export interface ICard extends Readonly<ICardPropertiesCommon> {
  readonly id?: ObjectId;
  readonly image?: string;
  update(props: Partial<ICardProperties>): void;
  commit(): void;
  delete(): void;
}

export function newCard(): ICard {
  throw new Error('Not implemented');
}
