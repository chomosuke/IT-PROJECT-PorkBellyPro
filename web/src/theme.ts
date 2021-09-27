import { IRawStyle } from '@fluentui/react';

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

export interface Theme {
  palette: Palette;
  shape: Shape;
}
