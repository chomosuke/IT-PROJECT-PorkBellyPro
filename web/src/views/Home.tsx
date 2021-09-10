import PropTypes from 'prop-types';
import React from 'react';
import { HomeProvider } from '../HomeContext';
import { ICard } from '../controllers/Card';

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
