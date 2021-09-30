/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import PropTypes from 'prop-types';
import React, {
  KeyboardEvent, MouseEvent, VoidFunctionComponent, WeakValidationMap, useRef, useState,
} from 'react';
import { Icon as PhosphorIcon } from 'phosphor-react';
import { ContextualMenu, IContextualMenuItem, mergeStyleSets } from '@fluentui/react';
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
    palette: { justWhite, sootyBee },
  } = useTheme(); // eslint-disable-line react-hooks/rules-of-hooks

  const rootCommonStyles = {
    ...roboto,
    ...medium,
    alignItems: 'center',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '16px',
    height: '100%',
    userSelect: 'none',
  };

  return mergeStyleSets({
    root: {
      ...rootCommonStyles,
      color: justWhite,
      marginLeft: '12px',
      marginRight: '12px',
    },
    icon: {
      height: '32px',
      width: '32px',
    },
    separator: {
      backgroundColor: justWhite,
      display: 'inline',
      height: '32px',
      marginLeft: '4px',
      marginRight: '4px',
      width: '1px',
    },
    caret: {
      height: '20px',
      width: '32px',
    },
    optionRoot: {
      ...rootCommonStyles,
      color: sootyBee,
      margin: '4px',
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
        {hasDropdown && [
          <div className={separator} />, <CaretDown className={caret} onClick={caretOnClick} />,
        ]}
      </div>
      {hasDropdown && (
      <ContextualMenu
        target={rootRef}
        items={items}
        hidden={menuHidden}
        onDismiss={hideMenu}
      />
      )}
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
