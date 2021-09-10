import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Stack, mergeStyleSets } from '@fluentui/react';
import { useApp } from '../AppContext';
import { HomeProvider } from '../HomeContext';
import { Card } from '../components/Card';
import { ICard } from '../controllers/Card';
import { CardDetails } from '../components/cardDetails/CardDetails';

export interface IHomeProps {
  detail?: ICard;
}

const getClassNames = (expand: boolean, detail: boolean) => {
  let templateColumnVar;
  if (detail) {
    templateColumnVar = expand ? '1fr 1fr' : '2fr 1fr';
  } else {
    templateColumnVar = '1fr 0fr';
  }

  return mergeStyleSets({
    root: {
      display: 'grid',
      gridTemplateAreas: '"a b"',
      gridTemplateColumns: templateColumnVar,
      height: '100%',
    },
    cardSection: {
      gridArea: 'a',
      overflow: 'auto',
    },
    detailSection: {
      gridArea: 'b',
      height: '100%',
      overflow: 'auto',
    },
  });
};

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export const Home: React.VoidFunctionComponent<IHomeProps> = ({ detail }) => {
  const [expand, setExpand] = useState(false);
  const { root, cardSection, detailSection } = getClassNames(expand, Boolean(detail));
  const { user, searchQuery } = useApp();
  if (user == null) throw new Error();

  const { cards } = user;

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
      (cToken) => cToken.toLowerCase().includes(sToken.toLowerCase()),
    ));
  }

  return (
    <HomeProvider value={{ expandCardDetail: setExpand, cardDetailExpanded: expand }}>
      <div className={root}>
        <div className={cardSection}>
          <Stack horizontal wrap>
            {cards.filter(filterCard).map((card) => <Card key={card.id} card={card} />)}
          </Stack>
        </div>
        {detail != null
          && (
          <div className={detailSection}>
            <CardDetails key={detail.id} card={detail} editing={detail.id === undefined} />
          </div>
          )}
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
