import PropTypes from 'prop-types';
import React, {
  RefObject, createRef, useEffect, useState,
} from 'react';
import { Stack, mergeStyleSets } from '@fluentui/react';
import { useApp } from '../AppContext';
import { HomeProvider } from '../HomeContext';
import { Card } from '../components/Card';
import { ICard } from '../controllers/Card';
import { CardDetails } from '../components/cardDetails/CardDetails';
import { useViewportSize } from '../ViewportSize';
import { TagButton } from '../components/TagButton';

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
    tagSection: {
      display: 'flex',
    },
    tagList: {
      // flex: '1',
      display: 'flex',
      flexDirection: 'row',
      overflowX: 'scroll',

      scrollBehavior: 'smooth',
      margin: '24px 0',
    },
  });
};

export const Home: React.VoidFunctionComponent<IHomeProps> = ({ detail }) => {
  // states
  const [expand, setExpand] = useState(false);
  const [lockedCard, setLockedCard] = useState<
  { ref: RefObject<HTMLDivElement>; yPos: number } | null
  >(null);
  const [unlockOnNextEffect, setUnlockOnNextEffect] = useState(false);
  // start at the top. 0 is top, 1 is bottom
  const [scrollPortion, setScrollPortion] = useState(0);

  /**
   * autoScroll start
   */

  // refs
  const cardSectionRef = createRef<HTMLDivElement>();

  // helpers
  const getCurrent = (ref: RefObject<HTMLDivElement>) => {
    const cardDiv = ref.current;
    if (cardDiv == null) {
      throw new Error('locked card is null');
    }
    return cardDiv;
  };
  const getDivTop = (div: HTMLDivElement) => div.getBoundingClientRect().top;

  // trigger rerender when viewport changes
  const viewPortSize = useViewportSize();

  // autoScroll
  useEffect(() => {
    // if card is locked, lock its scroll
    const cardSectionDiv = cardSectionRef.current;
    if (cardSectionDiv != null) {
      if (lockedCard != null) {
        if (getDivTop(getCurrent(lockedCard.ref)) !== lockedCard.yPos) {
          cardSectionDiv.scrollTop += getDivTop(getCurrent(lockedCard.ref)) - lockedCard.yPos;
        }
      } else {
        /*
         * no locked card or locked card already deleted
         * maintain scrollPortion
         */
        cardSectionDiv.scrollTop = scrollPortion * (
          cardSectionDiv.scrollHeight - cardSectionDiv.clientHeight
        );
      }
    }
  },
  // the change of below values means a change in cardGrid size
  [ // eslint-disable-line react-hooks/exhaustive-deps
    detail,
    expand,
    viewPortSize,
  ]);

  // card locking and unlocking
  const lockCard = (ref: RefObject<HTMLDivElement>) => {
    /*
     * calculate the YPos now because locked card can only happen after some renders.
     * you don't want to wait for it to rerender because the card y position might already have
     * been changed then
     */
    setLockedCard({
      ref,
      yPos: getDivTop(getCurrent(ref)),
    });
  };
  const unlockCard = () => setLockedCard(null);
  const unlockCardLater = () => setUnlockOnNextEffect(true);

  // unlock after close
  useEffect(() => {
    if (unlockOnNextEffect) {
      unlockCard();
      setUnlockOnNextEffect(false);
    }
  }, [unlockOnNextEffect]);

  /**
   * onScroll:
   *
   * The problem is that onScroll sometimes gets triggered upon resize
   * There's no good way to avoid this.
   * The solution is to recongize that when the user scroll, there'll be rapid onScroll without
   * any rerender.
   * Another thing to recognize is that when the viewport resize, Home will be rerender upon
   * every resize.
   * Hence if we suppress the first onScroll after rerender we should be able to suppress, not
   * only all the random onScroll on resize, but also all the programmatic scrollTop assignment,
   * while still capturing user's scroll event.
   *
   * Now, that should've been enough, but there's this senario where:
   * User select the last card.
   * The user makes the window wider and the number of rows descreases.
   * An onScroll is trigger by the browser as the scroll now exceed the max value (I'm guessing).
   * A second onScroll is called by my effect to scroll the lockedCard into the correct place.
   *
   * Hence I ignore the first 2 onScroll after render
   */
  let numOnScroll = 0;
  const onCardScroll = () => {
    numOnScroll += 1;
    if (numOnScroll < 3) {
      return;
    }

    // unlock lockedCard
    unlockCard();

    // record scrollPortion
    const cardSectionDiv = cardSectionRef.current;
    if (cardSectionDiv != null) {
      setScrollPortion(
        cardSectionDiv.scrollTop / (cardSectionDiv.scrollHeight - cardSectionDiv.clientHeight),
      );
    }
  };

  /**
   * autoScroll end
   */

  const {
    root, cardSection, detailSection, tagList, tagSection,
  } = getClassNames(expand, Boolean(detail));
  const { user, searchQuery, tagQuery } = useApp();
  if (user == null) throw new Error();

  const { cards, tags } = user;
  const context = useApp();

  function filterCard(card: ICard): boolean {
    const searchTokens = searchQuery.split(/\W/).filter((x) => x.length > 0);

    const cardTokens = [
      ...card.name.split(/\W/).filter((x) => x.length > 0),
      ...card.phone.split(/\W/).filter((x) => x.length > 0),
      ...card.email.split(/\W/).filter((x) => x.length > 0),
      ...card.jobTitle.split(/\W/).filter((x) => x.length > 0),
      ...card.company.split(/\W/).filter((x) => x.length > 0),
      ...card.fields.map((field) => field.value.split(/\W/).filter((x) => x.length > 0))
        .reduce((a, b) => a.concat(b), []),
    ];

    return searchTokens.every((searchToken) => cardTokens.some(
      (cardToken) => cardToken.toLowerCase().includes(searchToken.toLowerCase()),
    )) && tagQuery.every((qTag) => card.tags.includes(qTag));
  }

  const tagScrollRef = React.createRef<HTMLDivElement>();
  const scroll = (offset: number) => {
    const element = tagScrollRef.current;
    if (element) {
      element.scrollLeft += offset;
    }
  };

  return (
    <HomeProvider value={{
      expandCardDetail: setExpand,
      cardDetailExpanded: expand,
      lockCard,
      unlockCard,
      unlockCardLater,
    }}
    >
      <div className={root}>
        <div className={cardSection} ref={cardSectionRef} onScroll={onCardScroll}>
          <div className={tagSection}>
            <button type='button' onClick={() => scroll(-200)}> scroll left </button>
            <div className={tagList} ref={tagScrollRef}>
              {tags.map((tag) => (
                <TagButton
                  key={tag.id}
                  tag={tag}
                  onClick={() => {
                    if (!tagQuery.includes(tag)) {
                      context.update({ tagQuery: tagQuery.concat(tag) });
                    }
                  }}
                />
              ))}
            </div>
            <button type='button' onClick={() => scroll(200)}> scroll right </button>
          </div>

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
