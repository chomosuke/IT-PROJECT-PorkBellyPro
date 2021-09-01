import React from 'react';
import PropTypes from 'prop-types';

export interface ILoginProps {
  registering?: boolean;
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export const Login: React.VoidFunctionComponent<ILoginProps> = ({ registering }) => <></>;

Login.propTypes = {
  registering: PropTypes.bool,
};

Login.defaultProps = {
  registering: false,
};
