export interface ICardFieldProperties {
  key: string;
  value: string;
}

export interface ICardField extends Readonly<ICardFieldProperties> {
  update(props: Partial<ICardFieldProperties>): void;
}
