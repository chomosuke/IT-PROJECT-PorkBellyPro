import React from 'react';
import { ITextFieldProps, TextField } from '@fluentui/react';
import { func, string } from 'prop-types';
import { Theme, useTheme } from '../../theme';

export interface ITagSearchFieldProps {
  tagSearchString: string;
  setTagSearchString: (value: string) => void;
}

const getSearchFieldStyles: (theme: Theme) => ITextFieldProps['styles'] = (theme: Theme) => ({
  field: {
    ...theme.fontFamily.roboto,
    ...theme.fontSize.small,
    ...theme.fontWeight.medium,
    color: theme.palette.justWhite,
    whiteSpace: 'pre-wrap',
    height: '24px',
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
  const theme = useTheme();
  return (
    <TextField
      placeholder='create new tag'
      value={tagSearchString}
      borderless
      styles={getSearchFieldStyles(theme)}
      onChange={(event) => setTagSearchString(event.currentTarget.value)}
    />
  );
};

TagSearchField.propTypes = {
  tagSearchString: string.isRequired,
  setTagSearchString: func.isRequired,
};
