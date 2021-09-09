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

const stackStyles = {
  root: {
    backgroundColor: 'white',
    margin: '10% 0',
    width: '40%',
    textAlign: 'center',
    height: 'fit-content',
    borderRadius: '2vw',
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
  root: {
    height: '63px',
  },
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
const stackTokens = {
  padding: '5% 10%',
};

const getClassNames = () => mergeStyleSets({
  bodyStyle: {
    overflow: 'auto',
    display: 'flex',
    justifyContent: 'space-around',
    background: '#F8F8F8',
    height: '100%',
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

  return (
    <div className={bodyStyle} id='container'>
      <Stack styles={stackStyles} tokens={stackTokens}>
        <div>
          <TextField
            placeholder='Username'
            key={registering ? 'userRegister' : 'userLogin'}
            styles={fieldStyles}
            value={username}
            onGetErrorMessage={(value) => emptyField(value, 'Username')}
            validateOnFocusOut
            validateOnLoad={false}
            onChange={(event) => setUsername(event.currentTarget.value)}
          />
        </div>
        <div>
          <TextField
            placeholder='Password'
            type='password'
            key={registering ? 'passRegister' : 'passLogin'}
            styles={fieldStyles}
            value={password}
            onGetErrorMessage={(value) => emptyField(value, 'Password')}
            validateOnFocusOut
            validateOnLoad={false}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
        </div>
        <PrimaryButton
          styles={buttonStyle}
          onClick={loginEvent}
          text={registering ? 'Register' : 'Log in'}
        />
        <Link to={registering ? '/login' : '/register'}>
          <Label>
            {
              registering
                ? 'Already with an account? Sign in here.'
                : 'Register to get started'
            }
          </Label>
        </Link>
        <Label>Can&apos;t log in?</Label>
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
