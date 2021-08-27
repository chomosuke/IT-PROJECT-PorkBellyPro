import type { Card } from './Card';
import type { Image } from './Image';

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
interface CardPutRequest extends Omit<Card, 'id' | 'favorite' | 'hasImage'> {
  image?: Image;
}
