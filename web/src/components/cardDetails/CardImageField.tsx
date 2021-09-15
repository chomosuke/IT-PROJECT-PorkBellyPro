import React from 'react';
import Jimp from 'jimp/browser/lib/jimp';
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
                  setLoading(true);
                  (async () => {
                    if (e.target.files && e.target.files[0]) {
                      const img = e.target.files[0];
                      const jimg = await Jimp.read(Buffer.from(await img.arrayBuffer()));
                      if (jimg.getWidth() / jimg.getHeight() > imgWidth / imgHeight) {
                        jimg.resize(imgWidth, Jimp.AUTO);
                      } else {
                        jimg.resize(Jimp.AUTO, imgHeight);
                      }
                      const newImageUrl = await jimg.getBase64Async(Jimp.MIME_JPEG);
                      console.log(newImageUrl);
                      card.update({ image: newImageUrl });
                    }
                    setLoading(false);
                  })();
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
