# /api/me
## GET
- Authenticated

Request body: None

Response body:
```ts
import type { Card } from './Card';
import type { Settings } from './Settings';
import type { Tag } from './Tag';

interface MeResponse {
  username: string;
  settings: Settings;
  cards: Card[];
  tags: Tag[];
}
```
