import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Stack } from '@fluentui/react';
import { useApp } from '../AppContext';
import { HomeProvider } from '../HomeContext';
import { Card } from '../components/Card';
import { ICard } from '../controllers/Card';
import { CardDetails } from '../components/CardDetails';

export interface IHomeProps {
  detail?: ICard;
}

/// ///// fluent-ui stack styling ////////

/*
 *const stackStyles: IStackStyles = {
 *root: {
 *  background: DefaultPalette.themePrimary,
 *},
 *};
 */

/*
 * const StackItemStyles: IStackItemStyles = {
 *   root: {
 *     alignItems: 'center',
 *     display: 'flex',
 *     height: '50vh',
 *     justifyContent: 'center',
 *   },
 * };
 */

/*
 * const stackTokens: IStackTokens = {
 *   childrenGap: 5,
 *   padding: 20,
 * };
 */

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export const Home: React.VoidFunctionComponent<IHomeProps> = ({ detail }) => {
  // const [ currentCard, expandCardDetail ] = useState<string | undefined>(defaultStatus);

  const [expand, setExpand] = useState(false);
  const { user, searchQuery } = useApp();
  if (user == null) throw new Error();

  const { cards } = user;

  function expandCardDetail(value: boolean): void {
    setExpand(value);
  }

  function filterCard(card: ICard): boolean {
    const searchedTokens = searchQuery.split(/\W/).filter((x) => x.length > 0);

    const searchedCard = [
      ...card.name.split(/\W/).filter((x) => x.length > 0),
      ...card.phone.split(/\W/).filter((x) => x.length > 0),
      ...card.email.split(/\W/).filter((x) => x.length > 0),
      ...card.jobTitle.split(/\W/).filter((x) => x.length > 0),
      ...card.company.split(/\W/).filter((x) => x.length > 0),
      ...card.fields.map((field) => field.value.split(/\W/).filter((x) => x.length > 0))
        .reduce((a, b) => a.concat(b), []),
    ];

    return searchedTokens.every((sToken) => searchedCard.some(
      (cToken) => cToken.includes(sToken),
    ));
  }

  return (
    <HomeProvider value={{ expandCardDetail }}>

      <Stack horizontal>

        <Stack.Item grow={2}>
          <Stack horizontal wrap>
            {cards.filter(filterCard).map((card) => <Card key={card.id} card={card} />)}
          </Stack>
        </Stack.Item>

        {detail != null
          && (
          <Stack.Item grow={expand ? 2 : 1}>

            <CardDetails card={detail} editing />

          </Stack.Item>
          )}

      </Stack>
    </HomeProvider>
  );
};

Home.propTypes = {
  detail: PropTypes.object as React.Validator<ICard | null | undefined> | undefined,
};

Home.defaultProps = {
  detail: undefined,
};
