# /api/card
## PUT
- Authenticated

Request body:
```ts
import type { Card } from './Card';
import type { Image } from './Image';

interface CardPutRequest extends Omit<Card, 'id' | 'favorite' | 'imageHash'> {
  image?: Image;
}
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
import type { Image } from './Image';

interface CardPatchRequest extends Pick<Card, 'id'>, Partial<Omit<Card, 'id' | 'imageHash'>> {
  image?: Image | null;
}
```

Response body:
```ts
import type { Card } from './Card';

type CardPatchResponse = Card;
```
