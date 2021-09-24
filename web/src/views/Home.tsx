import PropTypes from 'prop-types';
import React, {
  RefObject, createRef, useEffect, useState,
} from 'react';
import { Stack, mergeStyleSets } from '@fluentui/react';
import { ObjectId } from '@porkbellypro/crm-shared';
import { useApp } from '../AppContext';
import { HomeProvider } from '../HomeContext';
import { Card } from '../components/Card';
import { ICard } from '../controllers/Card';
import { CardDetails } from '../components/cardDetails/CardDetails';
import { useViewportSize } from '../ViewportSize';

export interface IHomeProps {
  detail?: ICard;
  showCardDetail(card: ICard | null): void;
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
export const Home: React.VoidFunctionComponent<IHomeProps> = ({ detail, showCardDetail }) => {
  const [expand, setExpand] = useState(false);

  const [lockedCard, setLockedCard] = useState< { id: ObjectId; yPos: number } | null>(null);
  const [unlockOnNextEffect, setUnlockOnNextEffect] = useState(false);

  const cardRefs: { id?: ObjectId; ref: RefObject<HTMLDivElement> }[] = [];

  const cardSectionRef = createRef<HTMLDivElement>();

  console.log('rerendered');

  const findCardDiv = (cardId: ObjectId) => {
    const cardDiv = cardRefs.find((cardRef) => cardId === cardRef.id)?.ref?.current;
    if (cardDiv == null) {
      throw new Error('card ref not found');
    }
    return cardDiv;
  };
  const getDivTop = (div: HTMLDivElement) => div.getBoundingClientRect().top;

  // trigger rerender when viewport changes
  useViewportSize();

  // I want it to run on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // if card is locked, lock its scroll
    if (lockedCard != null) {
      const cardDiv = findCardDiv(lockedCard.id);
      const cardSectionDiv = cardSectionRef.current;
      if (getDivTop(cardDiv) !== lockedCard.yPos && cardSectionDiv != null) {
        cardSectionDiv.scrollTop += getDivTop(cardDiv) - lockedCard.yPos;
      }

      if (unlockOnNextEffect) {
        setLockedCard(null);
        setUnlockOnNextEffect(false);
      }
    }
  });

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

  const onShowCardDetail = (card: ICard | null) => {
    showCardDetail(card);

    if (card?.id == null) {
      setUnlockOnNextEffect(true);
    } else {
      // find card ref
      const cardDiv = findCardDiv(card.id);

      /*
       * calculate the YPos now because locked card can only happen after render.
       * you don't want to wait for it to rerender because the card y position
       * might already have been changed then
       */
      setLockedCard({
        id: card.id,
        yPos: getDivTop(cardDiv),
      });
    }
  };

  return (
    <HomeProvider value={{
      expandCardDetail: setExpand,
      cardDetailExpanded: expand,
      showCardDetail: onShowCardDetail,
    }}
    >
      <div className={root}>
        <div className={cardSection} ref={cardSectionRef}>
          <Stack horizontal wrap>
            {cards.filter(filterCard).map((card) => {
              const ref = createRef<HTMLDivElement>();
              cardRefs.push({ id: card.id, ref });
              return <Card key={card.id} card={card} ref={ref} />;
            })}
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
  showCardDetail: PropTypes.func.isRequired,
};

Home.defaultProps = {
  detail: undefined,
};
