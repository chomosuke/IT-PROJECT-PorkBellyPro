import React, {
  Requireable, createRef, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  Callout, DefaultButton, DirectionalHint, ICalloutProps, Stack, Text, TextField, mergeStyleSets,
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { ICard } from '../../controllers/Card';
import { useApp } from '../../AppContext';
import { Tag } from './Tag';
import { ITag, ITagProperties } from '../../controllers/Tag';
import { TagWrapper } from './TagWrapper';
import { ITagEditorProps, TagEditor } from './TagEditor';
import { Theme, useTheme } from '../../theme';

export interface ITagPickerProps {
  targetCard: ICard;
  editing: boolean;
}

const textStyle = {
  lineHeight: '36px',
  verticalAlign: 'middle',
};

const getClassNames = (theme: Theme) => mergeStyleSets({
  text: {
    ...theme.fontFamily.roboto,
    ...theme.fontSize.standard,
    ...theme.fontWeight.medium,
    color: theme.palette.justWhite,
    minWidth: '120px',
    maxWidth: '120px',
    marginRight: '20px',
    whiteSpace: 'pre-wrap',
    ...textStyle,
  },
  addButton: {
    padding: '6px',
  },
  tagContainer: {
    paddingTop: '6px',
    paddingRight: '6px',
  },
  calloutStack: {
    backgroundColor: theme.palette.stoneBlue,
  },
  tagStackItem: {
    margin: '8px',
  },
});

const calloutStyle: (theme: Theme) => ICalloutProps['styles'] = (theme: Theme) => ({
  root: {
    ...theme.shape.default,
    backgroundColor: theme.palette.stoneBlue,
  },
  calloutMain: {
    ...theme.shape.default,
    backgroundColor: theme.palette.stoneBlue,
  },
});

export const TagPicker: React.VoidFunctionComponent<ITagPickerProps> = ({
  targetCard, editing,
}) => {
  const user = useApp();
  const [pickerActive, setPickerActive] = useState(false);
  const [tagSearchString, setTagSearchString] = useState('');

  type ITagAnchor = Pick<ITagEditorProps, 'tag' | 'anchor'>;
  const [focusedTag, setFocusedTag] = useState<ITagAnchor>();

  const pickerTargetId = useId('picker-target');

  const theme = useTheme();
  const {
    text, addButton, tagContainer, calloutStack, tagStackItem,
  } = getClassNames(theme);

  const valueDivRef = createRef<HTMLDivElement>();
  const [calloutWidth, setCalloutWidth] = useState<number>(0);
  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    const currentWidth = valueDivRef.current?.clientWidth ?? 0;
    if (currentWidth !== calloutWidth) {
      setCalloutWidth(currentWidth);
    }
    /**
     * valueDivRef.current?.clientWidth as dependency isn't correct because width isn't knowable
     * before render.
     */
  });

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
      <Text className={text}>Tags</Text>
      <Stack.Item grow>
        <div ref={valueDivRef}>
          <Stack horizontal wrap id={pickerTargetId}>
            {targetCard?.tags.map((t) => (
              <Stack.Item className={tagContainer}>
                {editing
                  ? (
                    <Tag
                      tag={t}
                      key={t.id}
                      onRemove={() => removeTag(t)}
                    />
                  )
                  : <Tag tag={t} key={t.id} />}
              </Stack.Item>
            ))}
            {editing
              && (
              <theme.icon.plusCircleTag
                size={24}
                className={addButton}
                onClick={() => setPickerActive((old) => !old)}
                color={theme.palette.justWhite}
              />
              )}
          </Stack>
        </div>
      </Stack.Item>
      {pickerActive
        ? (
          <Callout
            coverTarget
            alignTargetEdge
            target={`#${pickerTargetId}`}
            isBeakVisible={false}
            minPagePadding={0}
            onDismiss={() => {
              if (!focusedTag) setPickerActive(false);
            }}
            directionalHint={DirectionalHint.topCenter}
            calloutMinWidth={calloutWidth}
            calloutMaxWidth={calloutWidth}
            styles={calloutStyle(theme)}
          >
            <Stack className={calloutStack}>
              <Stack.Item key='tagFinder' align='stretch'>
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
                  <Stack.Item key={t.id} align='stretch' className={tagStackItem}>
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
