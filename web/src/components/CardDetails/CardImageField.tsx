import React from 'react';
import Jimp from 'jimp/browser/lib/jimp';
import { Stack } from '@fluentui/react';
import { Requireable, bool, object } from 'prop-types';
import { ICard } from '../../controllers/Card';

export interface ICardImageFieldProps {
  card: ICard;
  editing: boolean;
}

const [imgWidth, imgHeight] = [500, 250];

export const CardImageField: React.VoidFunctionComponent<ICardImageFieldProps> = (
  { card, editing },
) => {
  const { image } = card;
  return (
    <>
      {editing
        ? (
          <Stack>
            {image && <img src={image} alt='business card' />}
            <input
              type='file'
              name='myImage'
              onChange={async (e) => {
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
              }}
            />
          </Stack>
        )
        : (image && <img src={image} alt='business card' />)}
    </>
  );
};

CardImageField.propTypes = {
  card: (object as Requireable<ICard>).isRequired,
  editing: bool.isRequired,
};
