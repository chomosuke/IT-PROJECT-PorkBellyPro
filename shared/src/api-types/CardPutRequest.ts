import type { Card } from './Card';
import type { Image } from './Image';

export interface CardPutRequest extends Omit<Card, 'id' | 'favorite' | 'hasImage'> {
  image?: Image;
}
