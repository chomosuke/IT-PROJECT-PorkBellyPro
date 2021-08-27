import { Card } from './Card';
import { Settings } from './Settings';
import { Tag } from './Tag';

export interface MeResponse {
  username: string;
  settings: Settings;
  cards: Card[];
  tags: Tag[];
}
