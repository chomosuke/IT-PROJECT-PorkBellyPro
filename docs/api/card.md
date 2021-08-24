# /api/card
## PUT
- Authenticated

Request body:
```ts
import type { Card } from './Card';

type CardPutRequest = Omit<Card, 'id' | 'favorite'>;
```

Response body:
```ts
import type { Card } from './Card';
type CardPutResponse = Card;
```
