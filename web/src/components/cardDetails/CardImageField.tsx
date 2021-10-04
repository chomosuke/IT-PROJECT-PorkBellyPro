import {
  IImageProps, Image, ImageFit, mergeStyleSets,
} from '@fluentui/react';
import { PromiseWorker, WorkerTerminatedError } from '@porkbellypro/crm-shared';
import React from 'react';
import {
  Requireable, bool, object,
} from 'prop-types';
import Loader from 'react-loader-spinner';
import { useBoolean } from '@fluentui/react-hooks';
import { ICard } from '../../controllers/Card';
import { useHome } from '../../HomeContext';
import { Theme, useTheme } from '../../theme';
import type { Message, Result } from './processImage';
import { WarningDialog, dialogType } from '../warningDialog';

export interface ICardImageFieldProps {
  card: ICard;
  editing: boolean;
}

const [imgWidth, imgHeight] = [600, 300];

const getClassNames = (theme: Theme, cardDetailExpanded: boolean) => mergeStyleSets({
  root: {
    position: 'relative',
    margin: 'auto',
    width: '100%',
    height: cardDetailExpanded ? '300px' : '200px',
    // subject to change.
    maxWidth: '600px',
  },
  noImageDiv: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.quartz,
    ...theme.fontFamily.roboto,
    ...theme.fontWeight.bold,
    ...theme.fontSize.title,
    color: theme.palette.cloudyDay,
    borderRadius: '12px',
  },
  hide: {
    display: 'none',
  },
  uploadImg: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    width: '48px',
    height: '48px',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    ...theme.shape.default,
    position: 'absolute',
    top: '16px',
    right: '80px',
  },
  deleteImg: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    width: '48px',
    height: '48px',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    ...theme.shape.default,
    border: 'none',
    position: 'absolute',
    top: '16px',
    right: '16px',
  },
  spinnerDiv: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
  },
});

const imageStyles: IImageProps['styles'] = {
  root: {
    width: '100%',
    height: '100%',
  },
  image: {
    borderRadius: '12px',
  },
};

const imgWorker = new PromiseWorker<Message, Result>(
  () => new Worker(new URL('./processImage.ts', import.meta.url)),
);

export const cancelLoading = (detailUnmounted: boolean): void => {
  imgWorker.restart({ detailUnmounted });
};

export const CardImageField: React.VoidFunctionComponent<ICardImageFieldProps> = (
  {
    card, editing,
  },
) => {
  const { image } = card;

  const [loading, setLoading] = React.useState(false);

  const { cardDetailExpanded } = useHome();

  const theme = useTheme();
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);

  const {
    noImageDiv, root, uploadImg, deleteImg, hide, spinnerDiv,
  } = getClassNames(theme, cardDetailExpanded);

  const onChangeImg = async (e: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
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
          if (!err.reason.detailUnmounted) {
            setLoading(false);
          }
          return;
        }
        throw err;
      }
      card.update({ image: url });
      setLoading(false);
    }
  };

  return (
    <>
      <WarningDialog
        hideDialog={hideDialog}
        toggleHideDialog={toggleHideDialog}
        type={dialogType.DELETE_TAG}
        onDelete={() => {
          card.update({ image: null });
          toggleHideDialog();
        }}
      />
      <div className={root}>
        {image
          ? (
            <Image
              styles={imageStyles}
              src={image}
              alt='business card'
              imageFit={ImageFit.cover}
            />
          )
          : (
            <div className={noImageDiv}>
              no image
            </div>
          )}
        {editing && (
        <>
          <label htmlFor='upload' className={uploadImg}>
            <input
              id='upload'
              className={hide}
              type='file'
              name='myImage'
              accept='image/*'
              onChange={onChangeImg}
            />
            <theme.icon.folderOpen size={28} />
          </label>
          <button
            type='button'
            className={deleteImg}
            onClick={toggleHideDialog}
          >
            <theme.icon.trash size={28} />
          </button>
        </>
        )}
        {loading && (
        <div className={spinnerDiv}>
          <Loader type='ThreeDots' color={theme.palette.deepSlate} width={100} height={100} />
        </div>
        )}
      </div>
    </>
  );
};

CardImageField.propTypes = {
  card: (object as Requireable<ICard>).isRequired,
  editing: bool.isRequired,
};
