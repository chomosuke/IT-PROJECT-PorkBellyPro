# /api/register
## POST
- 201 Created on registration success.
- 409 Conflict if username has already been regsitered.

Request body:
```ts
type Hashed = string;

interface RegisterRequest {
  username: string;
  password: Hashed;
}
```

Response body: None
