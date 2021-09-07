import {
  ObjectId, ensureArray, ensureObject, ensureType,
} from '@porkbellypro/crm-shared';
import { ResponseStatus } from '../ResponseStatus';
import {
  CardFieldMethods,
  ICardField,
  ICardFieldData,
  ICardFieldProperties,
  fromRaw as fieldFromRaw,
  implement as implementField,
} from './CardField';

interface ICardPropertiesCommon {
  favorite: boolean;
  name: string;
  phone: string;
  email: string;
  jobTitle: string;
  company: string;
}

export interface ICardProperties extends ICardPropertiesCommon {
  image: string | null;
  fields: readonly ICardFieldProperties[];
}

export interface ICard extends Readonly<ICardPropertiesCommon> {
  readonly id?: ObjectId;
  readonly image?: string;
  readonly fields: readonly ICardField[];
  update(props: Partial<ICardProperties>): void;
  commit(): Promise<ResponseStatus>;
  delete(): Promise<ResponseStatus>;
}

export interface ICardData extends ICardPropertiesCommon {
  id?: ObjectId;
  image?: string;
  fields: readonly Readonly<ICardFieldData>[];
}

export const cardDataDefaults: ICardData = Object.freeze({
  favorite: false,
  name: '',
  phone: '',
  email: '',
  jobTitle: '',
  company: '',
  fields: [],
});

export function fromRaw(raw: unknown): ICardData {
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

  const result = {
    id: ensureType(id, 'string'),
    favorite: ensureType(favorite, 'boolean'),
    name: ensureType(name, 'string'),
    phone: ensureType(phone, 'string'),
    email: ensureType(email, 'string'),
    jobTitle: ensureType(jobTitle, 'string'),
    company: ensureType(company, 'string'),
    image: ensureType(hasImage, 'boolean') ? `/image/${id}` : undefined,
    fields: ensureArray(fieldsRaw).map(fieldFromRaw),
  };

  if (result.image === undefined) delete result.image;

  return result;
}

export type CardMethods = Omit<ICard, keyof ICardData>;

export type CardFieldMethodsFactory = (
  field: Readonly<ICardFieldProperties>,
) => CardFieldMethods;

export function implement(
  data: Readonly<ICardData>,
  methods: CardMethods,
  fieldMethodsFactory: CardFieldMethodsFactory,
): ICard {
  return {
    ...data,
    fields: data.fields.map((field) => implementField(field, fieldMethodsFactory(field))),
    ...methods,
  };
}
