import { createContext, useContext } from 'react';

export interface IHomeContext {
  expandCardDetail(value: boolean): void;
}

const homeContext = createContext<IHomeContext | undefined>(undefined);

export const HomeProvider = homeContext.Provider;

export function useHome(): IHomeContext | undefined {
  return useContext(homeContext);
}
