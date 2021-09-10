import {
  IStyle, IStyleFunctionOrObject, Label, mergeStyleSets,
} from '@fluentui/react';
import PropTypes, { Requireable } from 'prop-types';
import React from 'react';

export type ILogoStyleProps = Record<string, never>;

export interface ILogoStyles {
  root?: IStyle;
}

export interface ILogoProps {
  styles?: IStyleFunctionOrObject<ILogoStyleProps, ILogoStyles>;
}

const getClassNames = (
  styles?: IStyleFunctionOrObject<ILogoStyleProps, ILogoStyles>,
) => mergeStyleSets(
  {
    root: {
      height: '32px',
    },
  },
  styles,
);

export const Logo: React.VoidFunctionComponent<ILogoProps> = (props) => {
  const { styles } = props;
  const { root } = getClassNames(styles);

  const labelStyles = {
    root: {
      height: '32px',
      margin: '0 8px 0 8px',
    },
  };

  return (
    <div className={root}>
      <Label styles={labelStyles}>PorkBelly</Label>
    </div>
  );
};

Logo.propTypes = {
  styles: (PropTypes.object as Requireable<
  IStyleFunctionOrObject<ILogoStyleProps, ILogoStyles>
  | null
  | undefined>),
};

Logo.defaultProps = {
  styles: undefined,
};
