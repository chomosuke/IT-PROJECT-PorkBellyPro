import { PromiseWorker, WorkerTerminatedError } from '@porkbellypro/crm-shared';
import React from 'react';
import {
  DefaultButton, Image, ImageFit, Spinner, SpinnerSize, Stack, mergeStyleSets,
} from '@fluentui/react';
import {
  Requireable, bool, object,
} from 'prop-types';
import { ICard } from '../../controllers/Card';

import type { Message, Result } from './processImage';

export interface ICardImageFieldProps {
  card: ICard;
  editing: boolean;
}

const [imgWidth, imgHeight] = [500, 250];

const getClassNames = () => mergeStyleSets({
  name: {
    backgroundColor: 'gray',
    textAlign: 'center',
  },
});

const imgWorker = new PromiseWorker<Message, Result>(
  () => new Worker(new URL('./processImage.ts', import.meta.url)),
);

export const cancelLoading = (): void => {
  imgWorker.restart();
};

export const CardImageField: React.VoidFunctionComponent<ICardImageFieldProps> = (
  {
    card, editing,
  },
) => {
  const { image } = card;

  const [loading, setLoading] = React.useState(false);

  const { name } = getClassNames();

  return (
    <Stack>
      <Stack.Item key='img'>
        {
        image
          ? (
            <>
              <Image
                src={image}
                alt='business card'
                imageFit={ImageFit.contain}
              />
              {editing && (
                <DefaultButton
                  text='delete'
                  onClick={() => {
                    card.update({ image: null });
                  }}
                />
              )}
            </>
          )
          : (
            <div className={name}>
              {card.name}
            </div>
          )
      }
      </Stack.Item>
      {editing
        && (
        <Stack.Item key='input'>
          <Stack horizontal>
            <Stack.Item key='input'>
              <input
                type='file'
                name='myImage'
                accept='image/*'
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const img = e.target.files[0];
                    setLoading(true);
                    let url;
                    try {
                      url = (await imgWorker.post({
                        img,
                        imgHeight,
                        imgWidth,
                      })).url;
                    } catch (err) {
                      if (err instanceof WorkerTerminatedError) {
                        setLoading(false);
                        return;
                      }
                      throw err;
                    }
                    card.update({ image: url });
                    setLoading(false);
                  }
                }}
              />
            </Stack.Item>
            {loading && <Spinner size={SpinnerSize.small} />}
          </Stack>
        </Stack.Item>
        )}
    </Stack>
  );
};

CardImageField.propTypes = {
  card: (object as Requireable<ICard>).isRequired,
  editing: bool.isRequired,
};
