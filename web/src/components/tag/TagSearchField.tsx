import React, { useState } from 'react';
import { ITextFieldProps, TextField } from '@fluentui/react';
import { func, string } from 'prop-types';
import { useId } from '@fluentui/react-hooks';
import { Theme, useTheme } from '../../theme';

export interface ITagSearchFieldProps {
  tagSearchString: string;
  setTagSearchString: (value: string) => void;
}

const getSearchFieldStyles: (theme: Theme, placeholder: boolean) => ITextFieldProps['styles'] = (
  theme: Theme, placeholder: boolean,
) => ({
  field: {
    ...theme.fontFamily.roboto,
    ...theme.fontSize.small,
    ...theme.fontWeight.medium,
    color: placeholder ? theme.palette.cloudyDay : theme.palette.justWhite,
    whiteSpace: 'pre-wrap',
    lineHeight: '24px',
    verticalAlign: 'middle',
  },
  fieldGroup: {
    height: '24px',
    borderRadius: theme.shape.default.borderRadius,
    backgroundColor: theme.palette.moldyCheese,
  },
});

export const TagSearchField: React.VoidFunctionComponent<ITagSearchFieldProps> = (
  { tagSearchString, setTagSearchString },
) => {
  const [focused, setFocused] = useState(false);

  const theme = useTheme();

  const key = useId('same key');
  /**
   * the two TextField below should be recognized by react as the same thing
   * I gave them the same key just in case.
   */
  return (
    tagSearchString === '' && !focused
      ? (
        <TextField
          key={key}
          value='create new tag'
          borderless
          onFocus={() => setFocused(true)}
          styles={getSearchFieldStyles(theme, true)}
          onChange={() => { throw new Error('placeholder is being being edited'); }}
        />
      )
      : (
        <TextField
          key={key}
          value={tagSearchString}
          borderless
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          styles={getSearchFieldStyles(theme, false)}
          onChange={(event) => setTagSearchString(event.currentTarget.value)}
        />
      )
  );
};

TagSearchField.propTypes = {
  tagSearchString: string.isRequired,
  setTagSearchString: func.isRequired,
};
