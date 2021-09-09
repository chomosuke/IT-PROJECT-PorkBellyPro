import {
  Label,
  PrimaryButton, Stack, TextField,
  mergeStyleSets,
} from '@fluentui/react';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';

export interface ILoginProps {
  registering?: boolean;
}

const getClassNames = () => mergeStyleSets({
  bodyStyle: {
    display: 'flex',
    height: '100%',
    justifyContent: 'space-around',
    overflow: 'auto',
  },
});

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
        } else {
          // error feedback for login fail
        }
      });
    }
  };

  // rudimentary controlled input event catchers
  const emptyField = (fieldValue: string, fieldName: string) => ((fieldValue) ? '' : `${fieldName} is required`);

  const { bodyStyle } = getClassNames();

  const textFieldStyles = {
    root: {
      height: '53px',
    },
  };

  const linkLabelStyles = {
    root: {
      cursor: 'pointer',
    },
  };

  return (
    <div className={bodyStyle} id='container'>
      <Stack tokens={{ childrenGap: '8px' }}>
        <TextField
          placeholder='Username'
          key={registering ? 'userRegister' : 'userLogin'}
          value={username}
          onGetErrorMessage={(value) => emptyField(value, 'Username')}
          validateOnFocusOut
          validateOnLoad={false}
          onChange={(event) => setUsername(event.currentTarget.value)}
          styles={textFieldStyles}
        />
        <TextField
          placeholder='Password'
          type='password'
          key={registering ? 'passRegister' : 'passLogin'}
          value={password}
          onGetErrorMessage={(value) => emptyField(value, 'Password')}
          validateOnFocusOut
          validateOnLoad={false}
          onChange={(event) => setPassword(event.currentTarget.value)}
          styles={textFieldStyles}
        />
        <PrimaryButton
          onClick={loginEvent}
          text={registering ? 'Register' : 'Log in'}
        />
        <Stack.Item align='center'>
          <Label styles={linkLabelStyles}>
            <Link to={registering ? '/login' : '/register'}>
              {
                registering
                  ? 'Already with an account? Sign in here.'
                  : 'Register to get started'
              }
            </Link>
          </Label>
        </Stack.Item>
        <Stack.Item align='center'>
          <Label>
            Can&apos;t log in?
          </Label>
        </Stack.Item>
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
