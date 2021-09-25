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

const getSwatchClassNames = (selectedColour: string) => {
  const height = 24;
  const borderRadius = height / 2;
  const width = 24;
  // Extracted from Figma
  const colours = [
    '#BF7829',
    '#127976',
    '#D61317',
    '#F3B27A',
    '#E5E5E5',
    '#77A69E',
    '#BC8282',
    '#78AFB2',
    '#84A9C3',
    '#5D68A6',
    '#662525',
    '#FBE900',
  ];

  return colours.map((colour) => [colour,
    mergeStyles([{
      height,
      width,
      borderRadius,
      backgroundColor: colour,
    },
    // when selectedColour matches then we have feedback on what colour is selected
    (colour === selectedColour) && {
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
  closingFunction: () => { },
};
