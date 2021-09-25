import React, {
  Requireable, useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  Callout, DefaultButton, Stack, TextField,
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { ICard } from '../../controllers/Card';
import { useApp } from '../../AppContext';
import { Tag } from '../Tag';
import { ITag, ITagProperties } from '../../controllers/Tag';
import { TagWrapper } from './TagWrapper';
import { ITagEditorProps, TagEditor } from './TagEditor';

export interface ITagPickerProps {
  targetCard: ICard;
  editing: boolean;
}

type ITagAnchor = Pick<ITagEditorProps, 'tag' | 'anchor'>;

export const TagPicker: React.VoidFunctionComponent<ITagPickerProps> = ({
  targetCard, editing,
}) => {
  const user = useApp();
  const [pickerActive, setPickerActive] = useState<boolean>(false);
  const [tagSearchString, setTagSearchString] = useState<string>('');
  const [focusedTag, setFocusedTag] = useState<ITagAnchor>();
  const pickerTargetId = useId('picker-target');

  function getNewTag(): void {
    const tagProps: Partial<ITagProperties> = {
      label: tagSearchString || 'New Tag',
    };
    // newTag refreshes context and may lead to loss of data.
    user.newTag(tagProps);
    setTagSearchString('');
  }

  function removeTag(t: ITag): void {
    targetCard.update({ tags: targetCard.tags.filter((that) => that.id !== t.id) });
  }

  // user variable is used to access the tags available to the user
  return (
    <Stack horizontal>
      <Stack.Item grow key='field'>
        Tags
      </Stack.Item>
      <Stack.Item grow key='tags'>
        {/* could style to fit measurements */}
        <Stack horizontal>
          {targetCard?.tags.map((t) => {
            if (editing) {
              return (
                <Tag
                  tag={t}
                  key={t.id}
                  onRemove={() => removeTag(t)}
                />
              );
            }

            return <Tag tag={t} key={t.id} />;
          })}
        </Stack>

      </Stack.Item>
      {editing
        && <DefaultButton text='Attach Tags' onClick={() => setPickerActive((old) => !old)} id={pickerTargetId} />}
      {pickerActive
        ? (
          <Callout
            target={`#${pickerTargetId}`}
            onDismiss={() => {
              if (!focusedTag) setPickerActive(false);
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
                .map((t) => (
                  <Stack.Item key={t.id}>
                    <TagWrapper
                      key={t.id}
                      tag={t}
                      card={targetCard}
                      setTagEdit={(id) => setFocusedTag({ anchor: id, tag: t })}
                    />
                  </Stack.Item>
                ))}
            </Stack>
          </Callout>
        )
        : null}
      {focusedTag
        && (
        <TagEditor
          anchor={`#${focusedTag.anchor}`}
          tag={focusedTag.tag}
          key='TagEditor'
          closingFunction={() => setFocusedTag(undefined)}
        />
        )}
    </Stack>
  );
};

TagPicker.propTypes = {
  targetCard: (PropTypes.object as Requireable<ICard>).isRequired,
  editing: PropTypes.bool.isRequired,
};
