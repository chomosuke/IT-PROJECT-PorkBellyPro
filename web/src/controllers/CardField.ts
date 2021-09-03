import { ensureObject, ensureType } from '@porkbellypro/crm-shared';

export interface ICardFieldProperties {
  key: string;
  value: string;
}

export interface ICardField extends Readonly<ICardFieldProperties> {
  update(props: Partial<ICardFieldProperties>): void;
}

export type ICardFieldData = ICardFieldProperties;

export function fromRaw(raw: unknown): ICardFieldData {
  const { key, value } = ensureObject(raw);

  return {
    key: ensureType(key, 'string'),
    value: ensureType(value, 'string'),
  };
}

export type CardFieldMethods = Pick<ICardField, 'update'>;

export function implement(
  data: Readonly<ICardFieldData>,
  methods: CardFieldMethods,
): ICardField {
  return {
    ...data,
    ...methods,
  };
}
