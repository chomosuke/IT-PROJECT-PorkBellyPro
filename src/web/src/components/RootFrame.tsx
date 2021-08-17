import PropTypes from 'prop-types';
import React from 'react';

export const RootFrame: React.FunctionComponent = ({ children }) => (
  <>
    {children}
  </>
);

RootFrame.propTypes = {
  children: PropTypes.node,
};

RootFrame.defaultProps = {
  children: null,
};
