import { IRawStyle } from '@fluentui/react';
import {
  CaretDoubleLeft,
  CaretDoubleRight,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  FloppyDisk,
  IconProps,
  MagnifyingGlass,
  MinusCircle,
  PencilLine,
  Icon as PhosphorIcon,
  PlusCircle,
  SignOut,
  Trash,
  UserCircle,
} from 'phosphor-react';
import { createElement, forwardRef } from 'react';

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
  floppyDiskBold: PhosphorIcon;
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

export const defaultTheme: Theme = {
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
    roboto: { fontFamily: 'Roboto' },
    ubuntu: { fontFamily: 'Ubuntu' },
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
    floppyDiskBold: makeIcon(FloppyDisk, 'bold'),
    magnifyingGlassLight: makeIcon(MagnifyingGlass, 'light'),
    caretDownLight: makeIcon(CaretDown, 'light'),
    signOutLight: makeIcon(SignOut, 'light'),
    plusCircleLight: makeIcon(PlusCircle, 'light'),
  },
};
