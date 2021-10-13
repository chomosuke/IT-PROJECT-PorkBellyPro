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
import { ITag } from './Tag';

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
  tags: readonly Pick<ITag, 'id'>[];
}

export interface ICard extends Readonly<ICardPropertiesCommon> {
  readonly id?: ObjectId;
  readonly image?: string;
  readonly fields: readonly ICardField[];
  readonly tags: readonly ITag[];
  update(props: Partial<ICardProperties>): void;
  commit(props?: Partial<ICardProperties>): Promise<ResponseStatus>;
  delete(): Promise<ResponseStatus>;
}

export interface ICardData extends ICardPropertiesCommon {
  id?: ObjectId;
  image?: string;
  fields: readonly Readonly<ICardFieldData>[];
  tags: readonly ObjectId[];
}

export const cardDataDefaults: ICardData = Object.freeze({
  favorite: false,
  name: '',
  phone: '',
  email: '',
  jobTitle: '',
  company: '',
  fields: [],
  tags: [],
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
    imageHash,
    fields: fieldsRaw,
    tags: tagsRaw,
  } = ensureObject(raw);

  const result = {
    id: ensureType(id, 'string'),
    favorite: ensureType(favorite, 'boolean'),
    name: ensureType(name, 'string'),
    phone: ensureType(phone, 'string'),
    email: ensureType(email, 'string'),
    jobTitle: ensureType(jobTitle, 'string'),
    company: ensureType(company, 'string'),
    image: imageHash ? `/api/image/${ensureType(imageHash, 'string')}` : undefined,
    fields: ensureArray(fieldsRaw).map(fieldFromRaw),
    tags: ensureArray(tagsRaw).map((tag) => ensureType(tag, 'string')),
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
  tags: readonly ITag[],
  fieldMethodsFactory: CardFieldMethodsFactory,
): ICard {
  return {
    ...data,
    fields: data.fields.map((field) => implementField(field, fieldMethodsFactory(field))),
    tags: data.tags.map((tagId) => {
      const found = tags.find((tag) => tag.id === tagId);
      if (found == null) throw new Error('No such tag');
      return found;
    }),
    ...methods,
  };
}
