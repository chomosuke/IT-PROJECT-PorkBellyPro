import type { Card } from './Card';
import type { Image } from './Image';

export interface CardPatchRequest extends Pick<Card, 'id'>, Partial<Omit<Card, 'id' | 'hasImage'>> {
  image?: Image | null;
}
