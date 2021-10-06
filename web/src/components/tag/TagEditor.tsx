import {
  Callout, DirectionalHint, ICalloutProps, ITextFieldProps, Stack, Text, TextField,
  mergeStyleSets, mergeStyles,
} from '@fluentui/react';
import PropTypes, { Requireable } from 'prop-types';
import React, { useState } from 'react';
import { useBoolean } from '@fluentui/react-hooks';
import { ITag, ITagProperties } from '../../controllers/Tag';
import { Theme, useTheme } from '../../theme';
import { WarningDialog } from '../warningDialog';

// closing Function is called to dismiss callout
export interface ITagEditorProps {
  tag: ITag;
  anchor: ICalloutProps['target'];
  width: number;
  closingFunction?: () => void;
}

const getSwatchClassNames = (selectedColor: string) => {
  const height = 24;
  const borderRadius = height / 2;
  const width = 24;
  // Extracted from Figma
  const colors = [
    '#bc8282',
    '#78afb2',
    '#2e2c2a',
    '#84a9c3',
    '#5d68a6',
    '#662525',
    '#fbe900',
    '#bf7829',
    '#127976',
    '#d61317',
    '#f3b27a',
    '#e5e5e5',
    '#77a69e',
  ];

  return colors.map((color) => [color,
    mergeStyles([{
      height,
      width,
      borderRadius,
      backgroundColor: color,
      cursor: 'pointer',
    },
    // when selectedColor matches then we have feedback on what color is selected
    (color === selectedColor) && {
      border: '2px solid white',
      boxSizing: 'border-box',
    }])]);
};

const getCalloutStyle: (theme: Theme) => ICalloutProps['styles'] = (theme: Theme) => ({
  root: {
    ...theme.shape.default,
    backgroundColor: theme.palette.stoneBlue,
  },
  calloutMain: {
    ...theme.shape.default,
    backgroundColor: theme.palette.stoneBlue,
    overflow: 'hidden',
  },
});

const getNewFieldStyles: (theme: Theme) => ITextFieldProps['styles'] = (theme: Theme) => ({
  field: {
    ...theme.fontFamily.roboto,
    ...theme.fontSize.small,
    ...theme.fontWeight.medium,
    color: theme.palette.justWhite,
    whiteSpace: 'pre-wrap',
    height: '32px',
  },
  fieldGroup: {
    height: '32px',
    borderRadius: theme.shape.default.borderRadius,
    backgroundColor: theme.palette.moldyCheese,
  },
});

const getClassNames = (theme: Theme) => mergeStyleSets({
  tagStackItem: {
    margin: '8px',
  },
  separator: {
    borderColor: theme.palette.justWhite,
    borderStyle: 'solid',
    borderWidth: '1px',
  },
  deleteButton: {
    cursor: 'pointer',
  },
  removeTagText: {
    ...theme.fontFamily.roboto,
    ...theme.fontSize.small,
    ...theme.fontWeight.medium,
    color: theme.palette.justWhite,
  },
});

export const TagEditor: React.VoidFunctionComponent<ITagEditorProps> = ({
  tag, anchor, width, closingFunction,
}) => {
  const [unstagedState, setState] = useState<ITagProperties>(tag);
  const updateLabel = (newLabel: string) => setState({ ...unstagedState, label: newLabel });
  const updateColor = (newColor: string) => setState({ ...unstagedState, color: newColor });
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);

  const deleteTag = async () => {
    tag.delete();
    if (closingFunction) closingFunction();
  };

  const swatchStyles = getSwatchClassNames(unstagedState.color);

  const theme = useTheme();

  const {
    tagStackItem, separator, deleteButton, removeTagText,
  } = getClassNames(theme);

  return (
    <Callout
      target={anchor}
      onDismiss={() => {
        tag.commit(unstagedState);
        if (closingFunction) closingFunction();
      }}
      isBeakVisible={false}
      minPagePadding={0}
      directionalHint={DirectionalHint.bottomCenter}
      calloutMaxWidth={width}
      calloutMinWidth={width}
      styles={getCalloutStyle(theme)}
    >
      <WarningDialog
        hideDialog={hideDialog}
        closeButtonOnClick={toggleHideDialog}
        closeButtonStr='Cancel'
        okButtonOnClick={deleteTag}
        okButtonStr='Yes, Delete'
        title='Warning'
        subText={'Deleted tags won\'t be recoverable, are you sure you want to do that?'}
      />
      <Stack.Item key='separator' align='stretch' className={tagStackItem}>
        <TextField
          borderless
          ariaLabel='New textfield name'
          value={unstagedState.label}
          onChange={(ev) => updateLabel(ev.currentTarget.value)}
          styles={getNewFieldStyles(theme)}
        />
      </Stack.Item>
      <Stack.Item key='separator' align='stretch' className={tagStackItem}>
        <Stack horizontal tokens={{ childrenGap: '8px' }} onClick={toggleHideDialog} className={deleteButton}>
          <theme.icon.trash size={24} color={theme.palette.justWhite} />
          <Stack.Item align='center'>
            <Text className={removeTagText}>remove tag</Text>
          </Stack.Item>
        </Stack>
      </Stack.Item>
      <Stack.Item key='separator' align='stretch' className={tagStackItem}>
        <div className={separator} />
      </Stack.Item>
      <Stack horizontal wrap tokens={{ childrenGap: '12px 20px', padding: '8px' }}>
        {swatchStyles.map(([color, className]) => (
          // Colour swatches
          <div
            role='none'
            key={`swatch${color}`}
            className={className}
            onClick={() => updateColor(color)}
            onKeyDown={undefined}
          />
        ))}
      </Stack>
    </Callout>
  );
};

TagEditor.propTypes = {
  tag: (PropTypes.object as Requireable<ITag>).isRequired,
  anchor: (PropTypes.oneOfType([
    PropTypes.object as Requireable<ICalloutProps['target']>, PropTypes.string,
  ])).isRequired,
  width: PropTypes.number.isRequired,
  closingFunction: PropTypes.func,
};

TagEditor.defaultProps = {
  closingFunction: () => {},
};
