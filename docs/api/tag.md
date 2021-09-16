# /api/tag
## PUT
- Authenticated

Request body:
```ts
import { Tag } from './Tag';

type TagPutRequest = Omit<Tag, 'id'>;
```

Response body:
```ts
import { Tag } from './Tag';

type TagPutResponse = Tag;
```

## PATCH
- Authenticated
- 410 Gone if tag does not exist.

Request body:
```ts
import { Tag } from './Tag';

type TagPatchRequest = Pick<Tag, 'id'> & Partial<Omit<Tag, 'id'>>;
```

Response body:
```ts
import { Tag } from './Tag';

type TagPatchResponse = Tag;
```

## DELETE
- Authenticated
- 410 Gone if tag does not exist.

Request body:
```ts
import { Tag } from './Tag';

type TagDeleteRequest = Pick<Tag, 'id'>;
```

Response body: None
