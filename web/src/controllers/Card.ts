import {
  ObjectId, ensureArray, ensureObject, ensureType,
} from '@porkbellypro/crm-shared';
import { ResponseStatus } from '../ResponseStatus';
import { impl as CardField, ICardField } from './CardField';

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
  commit(): Promise<ResponseStatus>;
  delete(): Promise<ResponseStatus>;
}

export function newCard(): ICard {
  throw new Error('Not implemented');
}

class RawCard implements ICard {
  readonly favorite: boolean;

  readonly name: string;

  readonly phone: string;

  readonly email: string;

  readonly jobTitle: string;

  readonly company: string;

  readonly fields: readonly ICardField[];

  readonly id: ObjectId;

  readonly image?: string;

  constructor(raw: unknown) {
    const {
      id,
      favorite,
      name,
      phone,
      email,
      jobTitle,
      company,
      hasImage,
      fields: fieldsRaw,
    } = ensureObject(raw);

    this.id = ensureType(id, 'string');
    this.favorite = ensureType(favorite, 'boolean');
    this.name = ensureType(name, 'string');
    this.phone = ensureType(phone, 'string');
    this.email = ensureType(email, 'string');
    this.jobTitle = ensureType(jobTitle, 'string');
    this.company = ensureType(company, 'string');
    if (ensureType(hasImage, 'boolean')) {
      this.image = `/image/${id}`;
    }

    const fields = ensureArray(fieldsRaw);
    this.fields = fields.map(CardField.fromRaw);
  }

  /* eslint-disable-next-line class-methods-use-this */
  update() { }

  /* eslint-disable-next-line class-methods-use-this */
  commit() { return Promise.reject(); }

  /* eslint-disable-next-line class-methods-use-this */
  delete() { return Promise.reject(); }
}

function fromRaw(raw: unknown): ICard {
  return new RawCard(raw);
}

export const impl = {
  fromRaw,
};
