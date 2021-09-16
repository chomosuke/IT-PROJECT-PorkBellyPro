/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */

import React from 'react';
import PropTypes from 'prop-types';
import {
  IImageProps, Image, ImageFit, Label, Stack, mergeStyleSets,
} from '@fluentui/react';
import { ICard } from '../controllers/Card';
import { useApp } from '../AppContext';

export interface ICardProps {
  card: ICard;
}

const getClassNames = () => {
  const height = '300px';
  const width = '300px';

  return mergeStyleSets({
    root: {
      height,
      width,
    },
    target: {
      cursor: 'pointer',
      height,
      left: '0',
      position: 'relative',
      top: '-100%',
      width,
      zIndex: '1',
    },
    imageContainer: {
      height: '200px',
      width,
    },
  });
};

const imageStyles: IImageProps['styles'] = {
  root: {
    height: 200,
  },
};

export const Card: React.VoidFunctionComponent<ICardProps> = ({ card }) => {
  const {
    name,
    phone,
    jobTitle,
    image,
  } = card;
  const { showCardDetail } = useApp();

  const { root, target, imageContainer } = getClassNames();

  const doShowCardDetail = () => {
    showCardDetail(card);
  };

  return (
    <div className={root}>
      <Stack>
        <div className={imageContainer}>
          {image != null && (
            <Image
              src={image}
              imageFit={ImageFit.contain}
              styles={imageStyles}
            />
          )}
        </div>
        <Label>{name}</Label>
        <Label>{phone}</Label>
        <Label>{jobTitle}</Label>
      </Stack>
      <div
        className={target}
        onClick={doShowCardDetail}
      />
    </div>
  );
};

Card.propTypes = {
  card: PropTypes.object as React.Validator<ICard> | undefined,
};

Card.defaultProps = {
  card: undefined,
};