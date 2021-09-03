import { RawCardField } from './RawCardField';

export interface ICardFieldProperties {
  key: string;
  value: string;
}

export interface ICardField extends Readonly<ICardFieldProperties> {
  update(props: Partial<ICardFieldProperties>): void;
}

export function fromRaw(raw: unknown): ICardField {
  return new RawCardField(raw);
}
