import React from 'react';
import Jimp from 'jimp/browser/lib/jimp';
import { DefaultButton, Stack } from '@fluentui/react';
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
  const imageComp = image
    ? (
      <>
        <img
          src={
            image.substr(0, 4) === 'data'
              ? image
              : `${image}?random=${Math.random()}`
          }
          alt='business card'
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
    : <div style={{ backgroundColor: 'gray', textAlign: 'center' }}>{ card.name }</div>;

  const [loading, setLoading] = React.useState(false);

  return (
    <Stack>
      {editing
        ? (
          <>
            <Stack.Item>{imageComp}</Stack.Item>
            <Stack.Item>
              <Stack horizontal>
                <Stack.Item>
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
                {loading && <Stack.Item>loading</Stack.Item>}
              </Stack>
            </Stack.Item>
          </>
        )
        : <Stack.Item>{imageComp}</Stack.Item>}
    </Stack>
  );
};

CardImageField.propTypes = {
  card: (object as Requireable<ICard>).isRequired,
  editing: bool.isRequired,
};
