/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import {
  IImageProps, Image, ImageFit, Label, Stack, keyframes, mergeStyleSets,
} from '@fluentui/react';
import { ICard } from '../controllers/Card';
import { useHome } from '../HomeContext';
import { cancelLoading } from './cardDetails/CardImageField';
import { useApp } from '../AppContext';
import { Theme, useTheme } from '../theme';

export interface ICardProps {
  card: ICard;
  selected: boolean;
}

const getClassNames = (selected: boolean, theme: Theme) => {
  const height = '300px';
  const width = '300px';

  const focusDecorator = keyframes({
    from: {
      boxShadow: '2px 4px 4px hsl(0deg 0% 0% / 0.25)',
    },
    to: {
      boxShadow: '8px 16px 16px hsl(0deg 0% 0% / 0.25)',
    },
  });

  const overflowCutOff = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const fontStandard = {
    ...theme.fontFamily.roboto,
    ...theme.fontSize.standard,
    color: theme.palette.sootyBee,
  };

  return mergeStyleSets({
    root: {
      position: 'relative',
      height,
      width,
      background: theme.palette.justWhite,
      ...theme.shape.default,
      '&:hover': {
        borderRadius: '8px',
        animationName: focusDecorator,
        animationDuration: '0.2s',
        animationFillMode: 'forwards',
      },
      userSelect: 'none',
    },
    cardContent: {
      height,
      width,
    },
    target: {
      cursor: 'pointer',
      height,
      width,
      borderRadius: '8px',
      top: '-100%',
      left: '0',
      position: 'relative',
      zIndex: '1',
      ...(selected
        ? {
          background: 'rgb(255, 255, 255, 0.05)',
          boxShadow: '8px 16px 16px hsl(0deg 0% 0% / 0.25)',
        }
        : {}),
    },
    imageContainer: {
      height: '200px',
      width,
    },
    labelContainer: {
      margin: '16px',
    },
    mainLabel: {
      ...fontStandard,
      fontSize: '18px',
      ...theme.fontWeight.bold,
      ...overflowCutOff,
    },
    subLabel: {
      ...fontStandard,
      ...theme.fontWeight.medium,
      ...overflowCutOff,
    },
    favoriteButton: {
      position: 'absolute',
      top: '8px',
      left: '8px',
      zIndex: '2',
      cursor: 'pointer',
      background: 'rgba(0, 0, 0, 0.4)',
      padding: '4px',
      ...theme.shape.shortShadow,
    },
  });
};

const imageStyles: IImageProps['styles'] = {
  root: {
    height: '200px',
    width: '300px',
    borderRadius: '8px 8px 0 0',
  },
};

export const Card: React.VoidFunctionComponent<ICardProps> = ({ card, selected }) => {
  const {
    name,
    phone,
    jobTitle,
    image,
    favorite,
  } = card;
  const { showCardDetail } = useApp();
  const { lockCard } = useHome();
  const theme = useTheme();

  const {
    root, cardContent, target, imageContainer, mainLabel, subLabel, labelContainer, favoriteButton,
  } = getClassNames(selected, theme);

  const ref = useRef<HTMLDivElement>(null);

  const doShowCardDetail = () => {
    showCardDetail(card);

    // incase image was still loading when user clicked on another card
    cancelLoading(true);
    lockCard(ref);
  };

  const favoriteOnClick = () => {
    card.commit({ favorite: !favorite });
  };

  return (
    <div className={root} ref={ref}>
      <Stack className={cardContent}>
        <div className={imageContainer}>
          {image != null && (
            <Image
              src={image}
              imageFit={ImageFit.cover}
              styles={imageStyles}
            />
          )}
        </div>
        <div className={labelContainer}>
          <Label className={mainLabel}>{name}</Label>
          <Label className={subLabel}>{phone}</Label>
          <Label className={subLabel}>{jobTitle}</Label>
        </div>
      </Stack>
      <div
        className={target}
        onClick={doShowCardDetail}
      />
      {favorite
        ? (
          <theme.icon.isFavorite
            size={32}
            className={favoriteButton}
            onClick={favoriteOnClick}
            color={theme.palette.favorite}
          />
        )
        : (
          <theme.icon.notFavorite
            size={32}
            className={favoriteButton}
            onClick={favoriteOnClick}
            color={theme.palette.cloudyDay}
          />
        )}
    </div>
  );
};

Card.propTypes = {
  card: (PropTypes.object as React.Requireable<ICard>).isRequired,
  selected: PropTypes.bool.isRequired,
};
