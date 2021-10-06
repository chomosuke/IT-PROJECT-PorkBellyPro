import { ObjectId, ensureObject, ensureType } from '@porkbellypro/crm-shared';
import { ResponseStatus } from '../ResponseStatus';

export interface ITagProperties {
  label: string;
  color: string;
}

export interface ITagData extends ITagProperties {
  id: ObjectId;
}

export interface ITag extends Readonly<ITagData> {
  commit(props: Partial<ITagProperties>): Promise<ResponseStatus>;
  delete(): Promise<ResponseStatus>;
}

export function fromRaw(raw: unknown): ITagData {
  const { id, label, color } = ensureObject(raw);
  return {
    id: ensureType(id, 'string'),
    label: ensureType(label, 'string'),
    color: ensureType(color, 'string'),
  };
}
