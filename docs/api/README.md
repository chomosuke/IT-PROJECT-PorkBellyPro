# REST APIs

TypeScript syntax is used to describe payload request and response bodies.

All APIs are assumed to respond with status 400 Bad Request if the request body is malformed.

All authenticated APIs are assumed to respond with 401 Unauthorized if no token cookie is given.
403 Forbidden if the token cookie is not accepted.

All requests will have a size limit of 1 MB.
413 Payload Too Large if any request size is larger than 1 MB.

|Document|Description|
|-|-|
[login.md](login.md)|Login endpoint.|
[register.md](register.md)|Register endpoint.|
[me.md](me.md)|User information read-only endpoint.|
[card.md](card.md)|Card CRUD actions.|
