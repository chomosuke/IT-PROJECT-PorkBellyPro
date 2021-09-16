import { get } from 'color-string';

export function isValidColor(color: string): boolean {
  return get(color) != null;
}
