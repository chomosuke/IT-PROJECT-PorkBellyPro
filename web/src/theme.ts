import { IRawStyle } from '@fluentui/react';
import merge from 'lodash.merge';
import {
  CaretDoubleLeft,
  CaretDoubleRight,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  Check,
  IconProps,
  MagnifyingGlass,
  MinusCircle,
  PencilLine,
  Icon as PhosphorIcon,
  PlusCircle,
  SignOut,
  Trash,
  UserCircle,
  X,
} from 'phosphor-react';
import {
  createContext, createElement, forwardRef, useContext, useMemo,
} from 'react';
import { PartialDeep, ReadonlyDeep } from 'type-fest';

export interface Palette {
  darkDenim: string;
  everblue: string;
  stoneBlue: string;
  moldyCheese: string;
  justWhite: string;
  quartz: string;
  cloudyDay: string;
  deepSlate: string;
  sootyBee: string;
}

export interface Shape {
  default: IRawStyle;
}

export interface FontFamily {
  roboto: IRawStyle;
  ubuntu: IRawStyle;
}

export interface FontWeight {
  light: IRawStyle;
  medium: IRawStyle;
  bold: IRawStyle;
  black: IRawStyle;
}

export interface FontSize {
  size16: IRawStyle;
  size24: IRawStyle;
  size36: IRawStyle;
}

export interface Icon {
  plusCircleBold: PhosphorIcon;
  minusCircleBold: PhosphorIcon;
  userCircleBold: PhosphorIcon;
  caretDownBold: PhosphorIcon;
  caretUpBold: PhosphorIcon;
  caretLeftBold: PhosphorIcon;
  caretRightBold: PhosphorIcon;
  caretDoubleLeftBold: PhosphorIcon;
  caretDoubleRightBold: PhosphorIcon;
  pencilLineBold: PhosphorIcon;
  trashBold: PhosphorIcon;
  checkBold: PhosphorIcon;
  xBold: PhosphorIcon;
  magnifyingGlassLight: PhosphorIcon;
  caretDownLight: PhosphorIcon;
  signOutLight: PhosphorIcon;
  plusCircleLight: PhosphorIcon;
}

export interface Theme {
  palette: Palette;
  shape: Shape;
  fontFamily: FontFamily;
  fontWeight: FontWeight;
  fontSize: FontSize;
  icon: Icon;
}

function makeIcon(icon: PhosphorIcon, weight: NonNullable<IconProps['weight']>): PhosphorIcon {
  return forwardRef<SVGSVGElement>((props, ref) => createElement(icon, { ...props, weight, ref }));
}

function freezeDeep<T>(value: T): ReadonlyDeep<T> {
  const frozenSet = new WeakSet();

  // eslint-disable-next-line @typescript-eslint/no-shadow, @typescript-eslint/no-explicit-any
  function recurse(value: any): any {
    switch (typeof value) {
      case 'object':
      case 'function':
        break;
      default:
        return value;
    }

    if (value in frozenSet) return value;

    frozenSet.add(Object.freeze(value));

    Reflect.ownKeys(value).forEach((key) => {
      recurse(value[key]);
    });

    return value;
  }

  return recurse(value);
}

export const defaultTheme = freezeDeep<Theme>({
  palette: {
    darkDenim: '#1a3240',
    everblue: '#2f5972',
    stoneBlue: '#627b8a',
    moldyCheese: '#8c99a1',
    justWhite: '#ffffff',
    quartz: '#f8f8f8',
    cloudyDay: '#c7c7c7',
    deepSlate: '#5e5e5e',
    sootyBee: '#0f0d0d',
  },
  shape: {
    default: {
      dropShadow: '2px 4px 4px rgb(0,0,0,0.25)',
      borderRadius: '8px',
    },
  },
  fontFamily: {
    roboto: { fontFamily: 'Roboto, sans-sarif' },
    ubuntu: { fontFamily: 'Ubuntu, sans-serif' },
  },
  fontWeight: {
    light: { fontWeight: '100' },
    medium: { fontWeight: '400' },
    bold: { fontWeight: '700' },
    black: { fontWeight: '900' },
  },
  fontSize: {
    size16: { fontSize: '16px' },
    size24: { fontSize: '24px' },
    size36: { fontSize: '36px' },
  },
  icon: {
    plusCircleBold: makeIcon(PlusCircle, 'bold'),
    minusCircleBold: makeIcon(MinusCircle, 'bold'),
    userCircleBold: makeIcon(UserCircle, 'bold'),
    caretDownBold: makeIcon(CaretDown, 'bold'),
    caretUpBold: makeIcon(CaretUp, 'bold'),
    caretLeftBold: makeIcon(CaretLeft, 'bold'),
    caretRightBold: makeIcon(CaretRight, 'bold'),
    caretDoubleLeftBold: makeIcon(CaretDoubleLeft, 'bold'),
    caretDoubleRightBold: makeIcon(CaretDoubleRight, 'bold'),
    pencilLineBold: makeIcon(PencilLine, 'bold'),
    trashBold: makeIcon(Trash, 'bold'),
    checkBold: makeIcon(Check, 'bold'),
    xBold: makeIcon(X, 'bold'),
    magnifyingGlassLight: makeIcon(MagnifyingGlass, 'light'),
    caretDownLight: makeIcon(CaretDown, 'light'),
    signOutLight: makeIcon(SignOut, 'light'),
    plusCircleLight: makeIcon(PlusCircle, 'light'),
  },
});

const ThemeContext = createContext<PartialDeep<Theme>>({});

export const ThemeProvider = ThemeContext.Provider;

export function useTheme(): ReadonlyDeep<Theme> {
  const partial = useContext(ThemeContext);
  const merged = useMemo(() => merge({}, defaultTheme, partial), [partial]);
  return merged;
}
