import PropTypes from 'prop-types';
import React, { createContext, useContext } from 'react';
import { ICard } from '../controllers/Card';

export interface IHomeContext {
  expandCardDetail(value: boolean): void;
}

const homeContext = createContext<IHomeContext | undefined>(undefined);

const HomeProvider = homeContext.Provider;

export function useHome(): IHomeContext | undefined {
  return useContext(homeContext);
}

export interface IHomeProps {
  detail?: ICard;
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export const Home: React.VoidFunctionComponent<IHomeProps> = ({ detail }) => {
  function expandCardDetail(): void { }

  return <HomeProvider value={{ expandCardDetail }} />;
};

Home.propTypes = {
  detail: PropTypes.object as React.Validator<ICard | null | undefined> | undefined,
};

Home.defaultProps = {
  detail: undefined,
};
