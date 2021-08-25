# /api/image
## POST
- Authenticated
- 413 Payload Too Large if binary is larger than 1 MB

Request body: Image binary

Response body:
```ts
import type { ObjectId } from './ObjectId';

interface ImagePostResponse {
    imageUrl: string;
}
```

# /api/image/imageId
## GET
- Authenticated
- 410 Gone if image does not exist.

Request body: None

Response body: Image binary

# /api/image/prune
## GET
- Authenticated

Request body: None

Response body: None