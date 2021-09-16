import { createContext, useContext } from 'react';
import { ICard } from './controllers/Card';
import { ITag, ITagProperties } from './controllers/Tag';
import { ResponseStatus } from './ResponseStatus';

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface ISettings { }

export interface IUser {
  readonly username: string;
  readonly settings: ISettings;
  readonly cards: readonly ICard[];
  readonly tags: readonly ITag[];
}

export interface IAppContextProperties {
  searchQuery: string;
  tagQuery: readonly Pick<ITag, 'id'>[];
}

export interface IAppContext extends Readonly<IAppContextProperties> {
  readonly user: IUser | null;
  update(props: Partial<IAppContextProperties>): void;
  showCardDetail(card: ICard | null): void;
  newCard(): void;
  newTag(props?: Partial<ITagProperties>): Promise<ResponseStatus>;
  login(username: string, password: string, register?: boolean): Promise<ResponseStatus>;
  logout(): Promise<ResponseStatus>;
}

const appContext = createContext<IAppContext | undefined>(undefined);

export const AppProvider = appContext.Provider;

export function useApp(): IAppContext {
  const context = useContext(appContext);
  if (context == null) throw new Error('context is null');

  return context;
}
