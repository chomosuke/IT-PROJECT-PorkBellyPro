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

## DELETE
- Authenticated
- 410 Gone if card does not exist.

Request body:
```ts
import type { ObjectId } from './ObjectId';

interface CardDeleteRequest {
  id: ObjectId;
}
```

Response body: None

## PATCH
- Authenticated
- 410 Gone if card does not exist.

Request body:
```ts
import type { Card } from './Card';

type CardPatchRequest = Pick<Card, 'id'> & Partial<Omit<Card, 'id'>>;
```

Response body:
```ts
import type { Card } from './Card';

type CardPatchResponse = Card;
```
