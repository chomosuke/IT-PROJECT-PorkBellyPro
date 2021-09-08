import PropTypes from 'prop-types';
import React, { createContext, useContext } from 'react';
import { ICard } from '../controllers/Card';
import { Card } from '../components/Card';

import { useApp } from '../AppContext';

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

  const { user } = useApp();
  if (user == null) throw new Error();

  const { cards } = user;

  return (
    <HomeProvider value={{ expandCardDetail }}>

      <h1>home page</h1>
      <div>
        <p>card grid section</p>
        {cards.map((card) => <Card key={card.id} card={card} />)}
      </div>
      <div>
        <p>card detail section</p>
      </div>

    </HomeProvider>
  );
};

Home.propTypes = {
  detail: PropTypes.object as React.Validator<ICard | null | undefined> | undefined,
};

Home.defaultProps = {
  detail: undefined,
};
