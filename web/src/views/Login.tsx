import {
  PrimaryButton, Stack, TextField,
} from '@fluentui/react';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';

export interface ILoginProps {
  registering?: boolean;
}

const stackStyles = {
  root: {
    backgroundColor: 'white',
    margin: '10% 0',
    width: '40%',
    textAlign: 'center',
    height: 'fit-content',
  },
};

const roundStyle = {
  borderRadius: '2vw',
};

const stackTokens = {
  padding: '5% 10%',
  childrenGap: '10px',
};

const buttonStyle = {
  root: {
    background: '#5A798D',
    borderRadius: '10px',
    height: '5em',
  },
  label: {
    fontSize: '1.5em',
  },
};

const fieldStyles = {
  fieldGroup: {
    borderRadius: '10px',
    border: '3px solid #5A798D',
    boxSizing: 'border-box',
    height: '3em',
  },
  field: {
    fontSize: '1.5em',
  },
};

const bodyStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  // background: "#F8F8F8",
  background: 'red',
  height: '100%',
};

export const Login: React.VoidFunctionComponent<ILoginProps> = ({ registering }) => {
  // get context
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const app = useApp();
  const loginEvent = () => {
    if (username && password) {
      app.login(username, password, registering).then((res) => {
        if (res.ok) {
          setUsername('');
          setPassword('');
        }
      });
    }
  };

  // rudimentary controlled input event catchers
  const emptyField = (fieldValue: string, fieldName: string) => ((fieldValue) ? '' : `${fieldName} is required`);

  return (
    <div style={bodyStyle} id='container'>
      <Stack styles={stackStyles} tokens={stackTokens} style={roundStyle}>
        <TextField
          placeholder='Username'
          styles={fieldStyles}
          value={username}
          onGetErrorMessage={(value) => emptyField(value, 'Username')}
          validateOnFocusOut
          validateOnLoad={false}
          onChange={(event) => setUsername(event.currentTarget.value)}
        />
        <TextField
          type='password'
          placeholder='Password'
          styles={fieldStyles}
          value={password}
          onGetErrorMessage={(value) => emptyField(value, 'Password')}
          validateOnFocusOut
          validateOnLoad={false}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
        <PrimaryButton
          styles={buttonStyle}
          onClick={loginEvent}
          text={registering ? 'Register' : 'Log in'}
        />
        <Link to={registering ? '/login' : '/register'}>
          {
          registering
            ? 'Already with an account? Sign in here.'
            : 'Register to get started'
        }
        </Link>
        <span>Can&apos;t log in?</span>
      </Stack>
    </div>
  );
};

Login.propTypes = {
  registering: PropTypes.bool,
};

Login.defaultProps = {
  registering: false,
};
