import { DefaultButton, Stack, mergeStyleSets } from '@fluentui/react';
import PropTypes, { Requireable, bool } from 'prop-types';
import React from 'react';
import { useApp } from '../../AppContext';
import { ICard } from '../../controllers/Card';
import { CardDetailActions } from './CardDetailActions';
import { CardExtraField } from './CardExtraField';
import { CardImageField } from './CardImageField';
import { CardMandatoryField } from './CardMandatoryField';
import { CardNoteField } from './CardNoteField';
import { TagPicker } from '../tagSelector/TagPicker';

export interface ICardDetailsProps {
  card: ICard;
  editing: boolean;
}

const getClassNames = () => mergeStyleSets({
  root: {
    display: 'grid',
    height: '100%',
    gridTemplateRows: 'auto 1fr auto',
  },
  content: {
    overflow: 'auto',
  },
});

export const CardDetails: React.VoidFunctionComponent<ICardDetailsProps> = ({ editing, card }) => {
  const app = useApp();

  const [isEditing, setIsEditing] = React.useState(editing);

  const {
    name, phone, email, jobTitle, company, fields,
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

  // enfore the existence of note
  if (note === undefined) {
    card.update({ fields: [{ key: 'note', value: '' }, ...fields] });
    // no need to commit as CardDetail will always make sure note exist.
    return <></>;
  }

  const [...restFields] = fields;
  restFields.splice(noteIndex, 1);

  const close = () => {
    app.showCardDetail(null);
  };

  const { root, content } = getClassNames();

  // no sort, order will be preserved on the server presumably
  return (
    <div className={root}>
      <DefaultButton text='close' onClick={close} />
      <div className={content}>
        <Stack>
          <Stack.Item key='image' align='stretch'>
            <CardImageField card={card} editing={isEditing} />
          </Stack.Item>
          <Stack.Item key='tags' align='stretch'>
            <TagPicker targetCard={card} editing={isEditing} />
          </Stack.Item>
          {mFields.map((field) => (
            <Stack.Item key={field.key} align='stretch'>
              <CardMandatoryField field={field} editing={isEditing} onEdit={field.onEdit} />
            </Stack.Item>
          ))}
          <Stack.Item key='note' align='stretch'>
            <CardNoteField field={note} editing={isEditing} />
          </Stack.Item>
          {restFields.map((field) => (
            <Stack.Item align='stretch'>
              <CardExtraField field={field} editing={isEditing} />
            </Stack.Item>
          ))}
          {isEditing
            && (
              <Stack.Item key='add field'>
                <DefaultButton
                  text='add field'
                  onClick={() => {
                    card.update({ fields: [...fields, { key: '', value: '' }] });
                  }}
                />
              </Stack.Item>
            )}
        </Stack>
      </div>
      <CardDetailActions
        card={card}
        editing={isEditing}
        onBeginEdit={() => {
          setIsEditing(true);
        }}
        onSave={() => {
          card.commit();
          setIsEditing(false);
        }}
        onCancel={() => {
          if (card.id === undefined) {
            close();
          } else {
            app.showCardDetail(card);
            setIsEditing(false);
          }
        }}
      />
    </div>
  );
};

CardDetails.propTypes = {
  card: (PropTypes.object as Requireable<ICard>).isRequired,
  editing: bool.isRequired,
};
