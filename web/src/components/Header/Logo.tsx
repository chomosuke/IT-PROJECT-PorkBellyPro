import {
  mergeStyleSets,
} from '@fluentui/react';
import PropTypes from 'prop-types';
import React from 'react';
import { useTheme } from '../../theme';

export interface ILogoProps {
  center?: boolean;
}

const getClassNames = (center: boolean) => {
  const {
    fontFamily: { roboto },
    fontWeight: { black },
    fontSize: { title },
    palette: { justWhite },
  } = useTheme(); // eslint-disable-line react-hooks/rules-of-hooks

  return mergeStyleSets({
    root: {
      ...roboto,
      ...black,
      ...title,
      alignContent: 'center',
      color: justWhite,
      display: 'grid',
      height: '100%',
      justifySelf: center ? 'center' : undefined,
      userSelect: 'none',
    },
  });
};

export const Logo: React.VoidFunctionComponent<ILogoProps> = (props) => {
  const { center: centerOption } = props;

  const center = centerOption ?? false;

  const {
    root,
  } = getClassNames(center);

  return (
    <div className={root}>
      PORKBELLY
    </div>
  );
};

Logo.propTypes = {
  center: PropTypes.bool,
};

Logo.defaultProps = {
  center: false,
};
