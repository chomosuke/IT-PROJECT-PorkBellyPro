import { IRawStyle } from '@fluentui/react';
import { Icon as PhosphorIcon } from 'phosphor-react';

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
