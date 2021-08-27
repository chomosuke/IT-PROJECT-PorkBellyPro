import type { Card } from './Card';
import type { Image } from './Image';

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
interface CardPatchRequest extends Pick<Card, 'id'>, Partial<Omit<Card, 'id' | 'hasImage'>> {
  image?: Image | null;
}
