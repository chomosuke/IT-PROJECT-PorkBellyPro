import {
  Callout, DefaultButton, ICalloutProps, Stack, TextField, mergeStyles,
} from '@fluentui/react';
import PropTypes, { Requireable } from 'prop-types';
import React, { useState } from 'react';
import { ITag, ITagProperties } from '../../controllers/Tag';

// closing Function is called to dismiss callout
export interface ITagEditorProps {
  tag: ITag;
  anchor: ICalloutProps['target'];
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
    '#bc8282',
  ];

  return colors.map((color) => [color,
    mergeStyles([{
      height,
      width,
      borderRadius,
      backgroundColor: color,
    },
    // when selectedColor matches then we have feedback on what color is selected
    (color === selectedColor) && {
      border: '2px solid black',
      boxSizing: 'border-box',
    }])]);
};

export const TagEditor: React.VoidFunctionComponent<ITagEditorProps> = ({
  tag, anchor, closingFunction,
}) => {
  const [unstagedState, setState] = useState<ITagProperties>(tag);
  const updateLabel = (newLabel: string) => setState({ ...unstagedState, label: newLabel });
  const updateColor = (newColor: string) => setState({ ...unstagedState, color: newColor });

  const deleteTag = async () => {
    tag.delete();
    if (closingFunction) closingFunction();
  };

  const swatchStyles = getSwatchClassNames(unstagedState.color);

  return (
    <Callout
      target={anchor}
      onDismiss={() => {
        tag.commit(unstagedState);
        if (closingFunction) closingFunction();
      }}
    >
      <TextField
        ariaLabel='New textfield name'
        value={unstagedState.label}
        onChange={(ev) => updateLabel(ev.currentTarget.value)}
      />

      {/* Can replace with Diaglog */}
      <DefaultButton text='Delete Tag' onClick={deleteTag} />
      {/* color swatches */}
      <Stack horizontal>
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
  closingFunction: PropTypes.func,
};

TagEditor.defaultProps = {
  closingFunction: () => {},
};
