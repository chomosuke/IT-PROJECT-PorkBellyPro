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
  Star,
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
  favorite: string;
}

export interface Shape {
  shortShadow: IRawStyle;
  default: IRawStyle;
}

export interface FontFamily {
  roboto: IRawStyle;
  ubuntu: IRawStyle;
}

export interface FontWeight {
  thin: IRawStyle;
  light: IRawStyle;
  regular: IRawStyle;
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
  trashBold: PhosphorIcon;
  dotsThree: PhosphorIcon;
  isFavorite: PhosphorIcon;
  notFavorite: PhosphorIcon;
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
    favorite: '#FFD84E',
  },
  shape: {
    shortShadow: {
      boxShadow: '4px 8px 8px hsl(0deg 0% 0% / 0.25)',
      borderRadius: '8px',
    },
    default: {
      boxShadow: '8px 16px 16px hsl(0deg 0% 0% / 0.25)',
      borderRadius: '8px',
    },
  },
  fontFamily: {
    roboto: { fontFamily: 'Roboto, sans-sarif' },
    ubuntu: { fontFamily: 'Ubuntu, sans-serif' },
  },
  fontWeight: {
    thin: { fontWeight: '100' },
    light: { fontWeight: '300' },
    regular: { fontWeight: '400' },
    medium: { fontWeight: '500' },
    bold: { fontWeight: '700' },
    black: { fontWeight: '900' },
  },
  fontSize: {
    small: { fontSize: '16px' },
    standard: { fontSize: '20px' },
    title: { fontSize: '28px' },
  },
  icon: {
    plusCircle: makeIcon(PlusCircle, 'regular'),
    minusCircle: makeIcon(MinusCircle, 'regular'),
    userCircle: makeIcon(UserCircle, 'regular'),
    caretDown: makeIcon(CaretDown, 'bold'),
    caretUp: makeIcon(CaretUp, 'bold'),
    caretLeft: makeIcon(CaretLeft, 'bold'),
    caretRight: makeIcon(CaretRight, 'bold'),
    caretDoubleLeft: makeIcon(CaretDoubleLeft, 'regular'),
    caretDoubleRight: makeIcon(CaretDoubleRight, 'regular'),
    pencilLine: makeIcon(PencilLine, 'regular'),
    trash: makeIcon(Trash, 'regular'),
    tick: makeIcon(Check, 'regular'),
    cross: makeIcon(X, 'regular'),
    magnifyingGlass: makeIcon(MagnifyingGlass, 'light'),
    signOut: makeIcon(SignOut, 'light'),
    plusCircleTag: makeIcon(PlusCircle, 'regular'),
    folderOpen: makeIcon(FolderOpen, 'bold'),
    trashBold: makeIcon(Trash, 'bold'),
    dotsThree: makeIcon(DotsThree, 'bold'),
    isFavorite: makeIcon(Star, 'fill'),
    notFavorite: makeIcon(Star, 'regular'),
  },
});

const ThemeContext = createContext<PartialDeep<Theme>>({});

export const ThemeProvider = ThemeContext.Provider;

export function useTheme(): ReadonlyDeep<Theme> {
  const partial = useContext(ThemeContext);
  const merged = useMemo(() => merge({}, defaultTheme, partial), [partial]);
  return merged;
}
