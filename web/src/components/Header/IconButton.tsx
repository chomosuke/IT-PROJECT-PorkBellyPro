/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import PropTypes from 'prop-types';
import React, {
  KeyboardEvent, MouseEvent, VoidFunctionComponent, WeakValidationMap, useRef, useState,
} from 'react';
import { Icon as PhosphorIcon } from 'phosphor-react';
import {
  ContextualMenu, IContextualMenuItem, keyframes, mergeStyleSets,
} from '@fluentui/react';
import { useTheme } from '../../theme';

export interface IIconButtonDropdownOption {
  label: string;
  icon?: PhosphorIcon;
  onClick?: (ev?: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void;
}

export interface IIconButtonProps {
  label: string;
  icon?: PhosphorIcon;
  dropdown?: IIconButtonDropdownOption[];
  onClick?: (ev?: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void;
}

const getClassNames = () => {
  const {
    fontFamily: { roboto },
    fontWeight: { medium },
    palette: {
      everblue, stoneBlue, justWhite, quartz, sootyBee,
    },
  } = useTheme(); // eslint-disable-line react-hooks/rules-of-hooks

  const rootCommonStyles = {
    ...roboto,
    ...medium,
    alignItems: 'center',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '16px',
    userSelect: 'none',
    padding: '0 16px',
  };

  const buttonHover = keyframes({
    from: {
      background: everblue,
      borderRadius: '4px',
    },
    to: {
      background: stoneBlue,
      borderRadius: '12px',
      color: quartz,
    },
  });

  return mergeStyleSets({
    root: {
      ...rootCommonStyles,
      color: justWhite,
      margin: '4px',
      ':hover': {
        animationName: buttonHover,
        animationDuration: '0.6s',
        animationFillMode: 'forwards',
      },
    },
    icon: {
      height: '32px',
      width: '32px',
      marginLeft: '-4px',
      marginRight: '4px',
    },
    separator: {
      backgroundColor: justWhite,
      display: 'inline',
      height: '28px',
      marginLeft: '8px',
      marginRight: '4px',
      width: '2px',
      borderRadius: '8px',
    },
    caret: {
      height: '20px',
      width: '32px',
      margin: '0 -8px 0 -4px',
    },
    optionRoot: {
      ...rootCommonStyles,
      color: sootyBee,
      margin: '16px',
      width: '100%',
    },
  });
};

export const IconButton: VoidFunctionComponent<IIconButtonProps> = (props) => {
  const {
    label,
    icon: Icon,
    dropdown: dropdownOption,
    onClick,
  } = props;

  const {
    icon: { caretDown: CaretDown },
  } = useTheme();

  const [menuHidden, setMenuHidden] = useState(true);
  const rootRef = useRef(null);

  const {
    root,
    icon,
    separator,
    caret,
    optionRoot,
  } = getClassNames();

  const dropdown = dropdownOption ?? [];
  const hasDropdown = dropdown.length > 0;

  const renderOption = (option: IIconButtonDropdownOption) => {
    const {
      icon: optionIcon,
      label, // eslint-disable-line @typescript-eslint/no-shadow
      onClick, // eslint-disable-line @typescript-eslint/no-shadow
    } = option;
    const IconType = optionIcon ?? 'div';

    return () => (
      <div className={optionRoot} onClick={onClick}>
        <IconType className={icon} />
        <span>{label}</span>
      </div>
    );
  };

  const items: IContextualMenuItem[] = dropdown.map((option) => ({
    key: label,
    onRender: renderOption(option),
  }));

  const toggleMenu = () => setMenuHidden((value) => !value);
  const hideMenu = () => setMenuHidden(true);

  const caretOnClick = (ev: MouseEvent) => {
    ev.stopPropagation();
    toggleMenu();
  };

  return (
    <>
      <div ref={rootRef} className={root} onClick={onClick ?? caretOnClick}>
        {Icon && <Icon className={icon} />}
        <span>{label}</span>
        {hasDropdown && (
        <>
          <div className={separator} />
          <CaretDown className={caret} onClick={caretOnClick} />
        </>
        )}
        {/**
         * According to FluentUI guidelines the ContextualMenu should always be rendered and have
         * its visibility controlled with the hidden prop. While this improves performance, it also
         * causes a bug where the popup will be drawn at the wrong position when the viewport size
         * changes while it was open.
         */}
        {hasDropdown && !menuHidden && (
        <ContextualMenu
          target={rootRef}
          items={items}
          onDismiss={hideMenu}
        />
        )}
      </div>
    </>
  );
};

IconButton.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType as WeakValidationMap<IIconButtonProps>['icon'],
  dropdown: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    icon: PropTypes.elementType as WeakValidationMap<IIconButtonProps>['icon'],
    onClick: PropTypes.func as WeakValidationMap<IIconButtonDropdownOption>['onClick'],
  }).isRequired),
  onClick: PropTypes.func as WeakValidationMap<IIconButtonProps>['onClick'],
};

IconButton.defaultProps = {
  icon: undefined,
  dropdown: undefined,
  onClick: undefined,
};
