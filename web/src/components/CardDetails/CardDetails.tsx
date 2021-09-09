import { Stack } from '@fluentui/react';
import PropTypes, { Requireable, bool } from 'prop-types';
import React from 'react';
import { useApp } from '../../AppContext';
import { ICard } from '../../controllers/Card';
import { CardDetailActions } from './CardDetailActions';
import { CardExtraField } from './CardExtraField';
import { CardImageField } from './CardImageField';
import { CardMandatoryField } from './CardMandatoryField';
import { CardNoteField } from './CardNoteField';

export interface ICardDetailsProps {
  card: ICard;
  editing: boolean;
}

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
  const note = fields[noteIndex];
  const [...restFields] = fields;
  restFields.splice(noteIndex, 1);

  // no sort, order will be preserved on the server presumably
  const fieldViews = (
    <Stack style={{ height: '100%' }}>
      <Stack style={{ overflowY: 'auto' }}>
        <Stack.Item key='image' align='stretch'>
          <CardImageField card={card} editing={isEditing} />
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
          <Stack.Item key={field.key} align='stretch'>
            <CardExtraField field={field} editing={isEditing} />
          </Stack.Item>
        ))}
      </Stack>
      <Stack.Item key='CardDetailActions'>
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
            app.showCardDetail(card);
            setIsEditing(false);
          }}
        />
      </Stack.Item>
    </Stack>
  );
  return fieldViews;
};

CardDetails.propTypes = {
  card: (PropTypes.object as Requireable<ICard>).isRequired,
  editing: bool.isRequired,
};
