import React, {
  Requireable, useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  Callout, DefaultButton, Stack, TextField,
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { ICard } from '../controllers/Card';
import { useApp } from '../AppContext';
import { Tag } from './Tag';
import { ITagProperties } from '../controllers/Tag';
import { TagWrapper } from './TagWrapper';

export interface ITagPickerProps {
  targetCard: ICard;
  editing: boolean;
}

export const TagPicker: React.VoidFunctionComponent<ITagPickerProps> = ({
  targetCard, editing,
}) => {
  const user = useApp();
  const [pickerActive, setPickerActive] = useState<boolean>(false);
  const [tagSearchString, setTagSearchString] = useState<string>('');
  const pickerTargetId = useId('picker-target');

  function getNewTag(): void {
    const tagProps: Partial<ITagProperties> = {
      label: tagSearchString || 'New Tag',
    };
    user.newTag(tagProps);
    setTagSearchString('');
  }

  // user variable is used to access the tags available to the user
  return (
    <Stack horizontal>
      <Stack.Item grow key='field'>
        Tags
      </Stack.Item>
      <Stack.Item grow key='tags' id={pickerTargetId}>
        {/* could style to fit measurements */}
        <Stack horizontal>
          {targetCard?.tags.map((t) => (
            <Tag
              key={t.id}
              tag={t}
              onRemove={() => {
                targetCard.update({ tags: targetCard.tags.filter((tag) => tag.id !== t.id) });
              }}
            />
          ))}
        </Stack>

      </Stack.Item>
      {editing
        && <DefaultButton text='Attach Tags' onClick={() => setPickerActive((old) => !old)} />}
      {pickerActive
        ? (
          <Callout
            target={`#${pickerTargetId}`}
            onDismiss={() => {
              setPickerActive(false);
            }}
          >
            <Stack>
              <Stack.Item key='tagFinder'>
                <TextField
                  placeholder='Tag Name'
                  value={tagSearchString}
                  onChange={(event) => setTagSearchString(event.currentTarget.value)}
                />
                <DefaultButton text='Create Tag' onClick={getNewTag} />
              </Stack.Item>
              {/* Tags available to use are listed here */}
              {user.user?.tags
                .filter((t) => t.label.toUpperCase().startsWith(tagSearchString.toUpperCase()))
                .filter((t) => !targetCard?.tags.includes(t))
                .map((t) => (
                  <Stack.Item key={t.id}>
                    <TagWrapper key={t.id} tag={t} card={targetCard} />
                  </Stack.Item>
                ))}
            </Stack>
          </Callout>
        )
        : null}
    </Stack>
  );
};

TagPicker.propTypes = {
  targetCard: (PropTypes.object as Requireable<ICard>).isRequired,
  editing: PropTypes.bool.isRequired,
};
