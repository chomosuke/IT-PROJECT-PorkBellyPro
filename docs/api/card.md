# /api/card
## PUT
- Authenticated

Request body:
```ts
import type { Card } from './Card';
import type { Image } from './Image';

interface CardPutRequest extends Omit<Card, 'id' | 'favorite' | 'hasImage'> {
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

interface CardPatchRequest extends Pick<Card, 'id'> & Partial<Omit<Card, 'id' | 'hasImage'>> {
  image?: Image;
}
```

Response body:
```ts
import type { Card } from './Card';

type CardPatchResponse = Card;
```
