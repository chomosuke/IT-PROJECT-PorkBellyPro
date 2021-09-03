import {
  ObjectId, ensureArray, ensureObject, ensureType,
} from '@porkbellypro/crm-shared';
import { ResponseStatus } from '../ResponseStatus';
import { ICardField, fromRaw } from './CardField';
import type { ICard } from './Card';

export class RawCard implements ICard {
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
    this.fields = fields.map(fromRaw);
  }

  /* eslint-disable-next-line class-methods-use-this */
  update(): void { }

  /* eslint-disable-next-line class-methods-use-this */
  commit(): Promise<ResponseStatus> { return Promise.reject(); }

  /* eslint-disable-next-line class-methods-use-this */
  delete(): Promise<ResponseStatus> { return Promise.reject(); }
}
