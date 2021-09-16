import { ObjectId } from '@porkbellypro/crm-shared';
import { ResponseStatus } from '../ResponseStatus';

export interface ITagProperties {
  label: string;
  color: string;
}

export interface ITag extends Readonly<ITagProperties> {
  readonly id: ObjectId;
  update(props: Partial<ITagProperties>): void;
  commit(): Promise<ResponseStatus>;
  delete(): Promise<ResponseStatus>;
}
