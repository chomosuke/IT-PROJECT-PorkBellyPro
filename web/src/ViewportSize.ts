/**
 * this file is copied from the project from INFO30005 Web info tech.
 * Both Shuang Li and ShangZhe Lee were in that team, and this file was written by ShangZhe in the
 * first semester of 2021.
 */
import React from 'react';
import { useWindow } from '@fluentui/react-window-provider';

// wrap useWindow to get width and height for responsive design
export const useViewportSize = (): IViewportSize => {
  const window = useWindow();
  const [viewport, setViewport] = React.useState<IViewportSize>({
    width: window?.innerWidth || 1,
    height: window?.innerHeight || 1,
  });

  React.useEffect(() => {
    if (window) {
      const onResize = () => {
        setViewport({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
    return () => {};
  });

  return viewport;
};

export interface IViewportSize {
  width: number;
  height: number;
}
