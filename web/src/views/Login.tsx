import {
  PrimaryButton, Stack, TextField,
} from '@fluentui/react';
import React from 'react';
import PropTypes from 'prop-types';

export interface ILoginProps {
  registering?: boolean;
}

const stackStyles = {
  root: {
    backgroundColor: 'lightBlue',
  },
};

const roundStyle = {
  borderRadius: '2vw',
};

const stackTokens = {
  padding: '10%',
  childrenGap: '5px',
};

const buttonStyle = {
  root: {
    background: '#5A798D',
    borderRadius: '10px',
  },
};

const fieldStyles = {
  fieldGroup: {
    borderRadius: '10px',
    border: '3px solid #5A798D',
    boxSizing: 'border-box',
    height: '5em',
  },

};

export const Login: React.VoidFunctionComponent<ILoginProps> = ({ registering }) => (
  <Stack styles={stackStyles} tokens={stackTokens} style={roundStyle}>
    <TextField placeholder='Username' styles={fieldStyles} />
    <TextField type='password' placeholder='Password' styles={fieldStyles} />
    <PrimaryButton styles={buttonStyle}>{registering ? 'register' : 'login'}</PrimaryButton>
  </Stack>
);

Login.propTypes = {
  registering: PropTypes.bool,
};

Login.defaultProps = {
  registering: false,
};
