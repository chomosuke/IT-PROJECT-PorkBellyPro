import { createContext, useContext } from 'react';
import { ICard } from './controllers/Card';

export interface IHomeContext {
  readonly cardDetailExpanded: boolean;
  expandCardDetail(value: boolean): void;
  showCardDetail(card: ICard | null): void;
}

const homeContext = createContext<IHomeContext | undefined>(undefined);

export const HomeProvider = homeContext.Provider;

export function useHome(): IHomeContext {
  const context = useContext(homeContext);
  if (context == null) throw new Error('context is nullish');

  return context;
}
