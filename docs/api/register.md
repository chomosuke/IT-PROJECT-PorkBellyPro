# /api/register
## POST
- 201 Created on registration success.
- 409 Conflict if username has already been regsitered.

Request body:
```ts
import type { Hashed } from './Hashed';

interface RegisterRequest {
  username: string;
  password: Hashed;
}
```

Response body: None
