import {
  Stack, Text, mergeStyleSets,
} from '@fluentui/react';
import PropTypes, { Requireable, bool } from 'prop-types';
import React, { useEffect } from 'react';
import { useApp } from '../../AppContext';
import { ICard } from '../../controllers/Card';
import { useHome } from '../../HomeContext';
import { CardDetailActions } from './CardDetailActions';
import { CardExtraField } from './CardExtraField';
import { CardImageField, cancelLoading } from './CardImageField';
import { CardMandatoryField } from './CardMandatoryField';
import { CardNoteField } from './CardNoteField';
import { TagPicker } from '../tag/TagPicker';
import { Theme, useTheme } from '../../theme';

export interface ICardDetailsProps {
  card: ICard;
  editing: boolean;
}

const textStyle = {
  lineHeight: '36px',
  verticalAlign: 'middle',
};

const getClassNames = (theme: Theme) => mergeStyleSets({
  root: {
    display: 'grid',
    height: '100%',
    gridTemplateRows: 'auto 1fr auto',
    backgroundColor: theme.palette.stoneBlue,
  },
  content: {
    overflow: 'auto',
  },
  closeButton: {
    cursor: 'pointer',
    margin: '12px 48px 24px auto',
  },
  addFieldButtonContainer: {
    cursor: 'pointer',
  },
  iconButton: {
    marginRight: '8px',
  },
  addFieldText: {
    ...theme.fontFamily.roboto,
    ...theme.fontSize.standard,
    ...theme.fontWeight.medium,
    color: theme.palette.justWhite,
    ...textStyle,
  },
  imageContainer: {
    position: 'relative',
  },
  favoriteButton: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    zIndex: '2',
    cursor: 'pointer',
    background: 'rgba(0, 0, 0, 0.4)',
    padding: '8px',
    ...theme.shape.default,
  },
});

export const CardDetails: React.VoidFunctionComponent<ICardDetailsProps> = ({ editing, card }) => {
  const { showCardDetail } = useApp();
  const { unlockCard, unlockCardLater, cardDetailExpanded } = useHome();

  const theme = useTheme();

  const [isEditing, setIsEditing] = React.useState(editing);

  const {
    name, phone, email, jobTitle, company, fields, favorite,
  } = card;
  const mFields = [
    { key: 'name', value: name, onEdit: (value: string) => card.update({ name: value }) },
    { key: 'phone', value: phone, onEdit: (value: string) => card.update({ phone: value }) },
    { key: 'email', value: email, onEdit: (value: string) => card.update({ email: value }) },
    { key: 'job title', value: jobTitle, onEdit: (value: string) => card.update({ jobTitle: value }) },
    { key: 'company', value: company, onEdit: (value: string) => card.update({ company: value }) },
  ];

  const noteIndex = fields.findIndex((field) => field.key === 'note');
  const note = noteIndex === -1 ? undefined : fields[noteIndex];

  /*
   * Enfore the existence of note.
   * useEffect() because update cannot be called in render as it'll change the state of another
   * component.
   */
  useEffect(() => {
    if (note === undefined) {
      card.update({ fields: [{ key: 'note', value: '' }, ...fields] });
      // no need to commit as CardDetail will always make sure note exist.
    }
  });
  if (note === undefined) {
    return <></>;
  }

  const [...restFields] = fields;
  restFields.splice(noteIndex, 1);

  const close = () => {
    unlockCardLater();
    showCardDetail(null);
  };

  const {
    root,
    content,
    closeButton,
    addFieldButtonContainer,
    iconButton,
    addFieldText,
    imageContainer,
    favoriteButton,
  } = getClassNames(theme);

  const favoriteOnClick = () => {
    if (card.id == null) {
      card.update({ favorite: !favorite });
    } else {
      card.commit({ favorite: !favorite });
    }
  };

  // no sort, order will be preserved on the server presumably
  return (
    <div className={root}>
      <theme.icon.cross
        id='closeButton'
        className={closeButton}
        color={theme.palette.justWhite}
        size={32}
        onClick={close}
      />
      <div className={content}>
        <Stack tokens={{
          childrenGap: '24px',
          padding: `0px ${cardDetailExpanded ? '152px' : '48px'}`,
        }}
        >
          <Stack.Item className={imageContainer} key='image' align='stretch'>
            <CardImageField
              card={card}
              editing={isEditing}
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
          </Stack.Item>
          <Stack.Item key='tags' align='stretch'>
            <TagPicker targetCard={card} editing={isEditing} />
          </Stack.Item>
          {mFields.filter((field) => (field.value !== '' || isEditing)).map((field) => (
            <Stack.Item key={field.key} align='stretch'>
              <CardMandatoryField field={field} editing={isEditing} onEdit={field.onEdit} />
            </Stack.Item>
          ))}
          {restFields.map((field, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Stack.Item key={index} align='stretch'>
              <CardExtraField field={field} editing={isEditing} />
            </Stack.Item>
          ))}
          {isEditing
            && (
              <Stack
                horizontal
                className={addFieldButtonContainer}
                onClick={() => {
                  card.update({ fields: [...fields, { key: '', value: '' }] });
                }}
              >
                <theme.icon.plusCircle
                  className={iconButton}
                  color={theme.palette.justWhite}
                  size={32}
                />
                <Text className={addFieldText}>Add field</Text>
              </Stack>
            )}
          <Stack.Item key='note' align='stretch'>
            <CardNoteField field={note} editing={isEditing} />
          </Stack.Item>

        </Stack>
      </div>
      <CardDetailActions
        editing={isEditing}
        newCard={card.id == null}
        onBeginEdit={() => {
          setIsEditing(true);
        }}
        onSave={() => {
          card.commit();
          setIsEditing(false);
          cancelLoading(false);
        }}
        onCancel={() => {
          if (card.id === undefined) {
            close();
          } else {
            showCardDetail(card);
            setIsEditing(false);
          }
        }}
        onDelete={() => {
          unlockCard();
          card.delete();
          cancelLoading(false);
        }}
      />
    </div>
  );
};

CardDetails.propTypes = {
  card: (PropTypes.object as Requireable<ICard>).isRequired,
  editing: bool.isRequired,
};
