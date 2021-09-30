import {
  Label,
  PrimaryButton, Stack, TextField,
  mergeStyleSets,
} from '@fluentui/react';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';
import { Theme, useTheme } from '../theme';

export interface ILoginProps {
  registering?: boolean;
}

const getClassNames = (theme: Theme) => mergeStyleSets({
  root: {
    background: theme.palette.quartz,
    height: '100%',
    padding: '120px 0',
  },
  bodyContainer: {
    background: theme.palette.justWhite,
    height: 'content-width',
    width: '90vw',
    maxWidth: '824px',

    margin: '0 auto',
    padding: '72px 0',
    borderRadius: '12px',
  },
  contentWrapper: {
    margin: '0 196px',
  },
});

export const Login: React.VoidFunctionComponent<ILoginProps> = ({ registering }) => {
  // get context
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const app = useApp();
  const theme = useTheme();

  const canSubmit = username && password;

  const onLoginClick = () => {
    if (canSubmit) {
      (async () => {
        const res = await app.login(username, password, registering);
        if (!res.ok) {
          // Show error dialog
        }
      })();
    }
  };

  // rudimentary controlled input event catchers
  const emptyField = (fieldValue: string, fieldName: string) => ((fieldValue) ? '' : `${fieldName} is required`);

  const { root, bodyContainer, contentWrapper } = getClassNames(theme);

  const textFieldStyles = {
    root: {
      height: '60px',
    },
    fieldGroup: {
      borderColor: theme.palette.stoneBlue,
    },
  };

  const linkLabelStyles = {
    root: {
      // cursor: 'pointer',
    },
  };

  const buttonStyle = {
    root: {
      background: theme.palette.stoneBlue,
      border: 'none',
    },
    rootHovered: {
      background: theme.palette.darkDenim,
    },
    rootPressed: {
      background: theme.palette.stoneBlue,
    },

  };

  return (
    <div className={root}>
      <div className={bodyContainer}>
        <Stack className={contentWrapper}>
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
            onClick={onLoginClick}
            text={registering ? 'Register' : 'Log in'}
            styles={buttonStyle}
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
    </div>
  );
};

Login.propTypes = {
  registering: PropTypes.bool,
};

Login.defaultProps = {
  registering: false,
};
