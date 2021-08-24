# /api/login
## POST
- On successful authentication, set the `Token` cookie.
- Status 401 if authentication fails.

Request body:
```ts
type Hashed = string;

interface LoginRequest {
  username: string;
  password: Hashed;
}
```

Response body: None
