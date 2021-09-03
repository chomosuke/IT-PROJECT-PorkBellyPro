import { ensureObject, ensureType } from '@porkbellypro/crm-shared';
import type { ICardField } from './CardField';

export class RawCardField implements ICardField {
  readonly key: string;

  readonly value: string;

  constructor(raw: unknown) {
    const { key, value } = ensureObject(raw);

    this.key = ensureType(key, 'string');
    this.value = ensureType(value, 'string');
  }

  /* eslint-disable-next-line class-methods-use-this */
  update(): void { }
}
