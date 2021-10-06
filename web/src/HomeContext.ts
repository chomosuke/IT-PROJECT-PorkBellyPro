import { RefObject, createContext, useContext } from 'react';

export interface IHomeContext {
  readonly cardDetailExpanded: boolean;
  expandCardDetail(value: boolean): void;
  lockCard(ref: RefObject<HTMLDivElement>): void;
  unlockCard(): void;
  unlockCardLater(): void;
}

const homeContext = createContext<IHomeContext | undefined>(undefined);

export const HomeProvider = homeContext.Provider;

export function useHome(): IHomeContext {
  const context = useContext(homeContext);
  if (context == null) throw new Error('context is nullish');

  return context;
}
