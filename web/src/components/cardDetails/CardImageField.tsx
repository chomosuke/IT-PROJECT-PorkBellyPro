import React from 'react';
import {
  DefaultButton, Image, ImageFit, Stack, mergeStyleSets,
} from '@fluentui/react';
import { Requireable, bool, object } from 'prop-types';
import { ICard } from '../../controllers/Card';

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

export const CardImageField: React.VoidFunctionComponent<ICardImageFieldProps> = (
  { card, editing },
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
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const img = e.target.files[0];
                    setLoading(true);
                    const worker = new Worker(new URL('./processImage.ts', import.meta.url));
                    worker.postMessage({
                      img,
                      imgWidth,
                      imgHeight,
                    });
                    worker.onmessage = ({ data: { url } }) => {
                      card.update({ image: url });
                      setLoading(false);
                      worker.terminate();
                    };
                  }
                }}
              />
            </Stack.Item>
            {loading && <Stack.Item key='load'>loading</Stack.Item>}
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
