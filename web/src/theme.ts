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
  DotsThree,
  FolderOpen,
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
  small: IRawStyle;
  standard: IRawStyle;
  title: IRawStyle;
}

export interface Icon {
  plusCircle: PhosphorIcon;
  minusCircle: PhosphorIcon;
  userCircle: PhosphorIcon;
  caretDown: PhosphorIcon;
  caretUp: PhosphorIcon;
  caretLeft: PhosphorIcon;
  caretRight: PhosphorIcon;
  caretDoubleLeft: PhosphorIcon;
  caretDoubleRight: PhosphorIcon;
  pencilLine: PhosphorIcon;
  trash: PhosphorIcon;
  tick: PhosphorIcon;
  cross: PhosphorIcon;
  magnifyingGlass: PhosphorIcon;
  signOut: PhosphorIcon;
  plusCircleTag: PhosphorIcon;
  folderOpen: PhosphorIcon;
  dotsThree: PhosphorIcon;
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
      boxShadow: '2px 4px 4px rgb(0,0,0,0.25)',
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
    small: { fontSize: '16px' },
    standard: { fontSize: '24px' },
    title: { fontSize: '36px' },
  },
  icon: {
    plusCircle: makeIcon(PlusCircle, 'bold'),
    minusCircle: makeIcon(MinusCircle, 'bold'),
    userCircle: makeIcon(UserCircle, 'bold'),
    caretDown: makeIcon(CaretDown, 'bold'),
    caretUp: makeIcon(CaretUp, 'bold'),
    caretLeft: makeIcon(CaretLeft, 'bold'),
    caretRight: makeIcon(CaretRight, 'bold'),
    caretDoubleLeft: makeIcon(CaretDoubleLeft, 'bold'),
    caretDoubleRight: makeIcon(CaretDoubleRight, 'bold'),
    pencilLine: makeIcon(PencilLine, 'bold'),
    trash: makeIcon(Trash, 'bold'),
    tick: makeIcon(Check, 'bold'),
    cross: makeIcon(X, 'bold'),
    magnifyingGlass: makeIcon(MagnifyingGlass, 'light'),
    signOut: makeIcon(SignOut, 'light'),
    plusCircleTag: makeIcon(PlusCircle, 'bold'),
    folderOpen: makeIcon(FolderOpen, 'bold'),
    dotsThree: makeIcon(DotsThree, 'bold'),
  },
});

const ThemeContext = createContext<PartialDeep<Theme>>({});

export const ThemeProvider = ThemeContext.Provider;

export function useTheme(): ReadonlyDeep<Theme> {
  const partial = useContext(ThemeContext);
  const merged = useMemo(() => merge({}, defaultTheme, partial), [partial]);
  return merged;
}
