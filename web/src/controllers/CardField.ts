import { ensureObject, ensureType } from '@porkbellypro/crm-shared';

export interface ICardFieldProperties {
  key: string;
  value: string;
}

export interface ICardField extends Readonly<ICardFieldProperties> {
  update(props: Partial<ICardFieldProperties>): void;
}

class RawCardField implements ICardField {
  readonly key: string;

  readonly value: string;

  constructor(raw: unknown) {
    const { key, value } = ensureObject(raw);

    this.key = ensureType(key, 'string');
    this.value = ensureType(value, 'string');
  }

  /* eslint-disable-next-line class-methods-use-this */
  update() { }
}

function fromRaw(raw: unknown): ICardField {
  return new RawCardField(raw);
}

export const impl = {
  fromRaw,
};
