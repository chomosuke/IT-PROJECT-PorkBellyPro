import React, {
  Requireable, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  Callout, DefaultButton, Stack, TextField,
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { ICard } from '../controllers/Card';
import { useApp } from '../AppContext';
import { Tag } from './Tag';
import { ITagEditorProps, TagEditor } from './TagEditor';
import { ITagProperties } from '../controllers/Tag';

export interface ITagPickerProps {
  targetCard: ICard;
}

export const TagPicker: React.VoidFunctionComponent<ITagPickerProps> = ({ targetCard }) => {
  const user = useApp();
  const [pickerActive, setPickerActive] = useState<boolean>(false);
  const [tagSearchString, setTagSearchString] = useState<string>('');
  const [focusedTag, setFocusedTag] = useState<ITagEditorProps>();
  const pickerTargetId = useId('picker-target');
  // map stores tag id keys and element values
  const tagTargetRefs = useRef(new Map());

  function getNewTag(): void {
    const tagProps: Partial<ITagProperties> = {
      label: tagSearchString || 'New Tag',
    };
    user.newTag(tagProps);
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
          {targetCard?.tags.map((t) => <Tag tag={t} onRemove={() => { }} />)}
        </Stack>

      </Stack.Item>
      <DefaultButton text='AttachCard' onClick={() => setPickerActive((old) => !old)} />
      {pickerActive
        ? (
          <Callout
            target={`#${pickerTargetId}`}
            onDismiss={() => setPickerActive(false)}
          >
            <Stack>
              <Stack.Item key='tagFinder'>
                <TextField
                  placeholder='Tag Name'
                  value={tagSearchString}
                  onChange={(event) => setTagSearchString(event.currentTarget.value)}
                />
                <DefaultButton text='CreateTag' onClick={getNewTag} />
              </Stack.Item>
              {/* Tags available to use are listed here */}
              {user.user?.tags
                .filter((t) => t.label.toUpperCase().startsWith(tagSearchString.toUpperCase()))
                .filter((t) => !targetCard?.tags.includes(t))
                .map((t) => (
                  <div ref={(el) => tagTargetRefs.current.set(t.id, el)}>
                    <Stack.Item key={t.id}>
                      <Tag tag={t} />
                      <DefaultButton
                        text='EditTag'
                        onClick={() => setFocusedTag({
                          tag: t,
                          anchor: tagTargetRefs.current.get(t.id),
                        })}
                      />
                    </Stack.Item>
                  </div>
                ))}
            </Stack>
            {focusedTag
              && (
                <TagEditor
                  tag={focusedTag.tag}
                  anchor={focusedTag.anchor}
                  closingFunction={() => setFocusedTag(undefined)}
                />
              )}
          </Callout>
        )
        : null}
    </Stack>
  );
};

TagPicker.propTypes = {
  targetCard: (PropTypes.object as Requireable<ICard>).isRequired,
};
