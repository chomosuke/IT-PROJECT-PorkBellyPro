# /api/me
## GET
- Authenticated

Request body: None

Response body:
```ts
interface CardField {
  key: string;
  value: string;
}

type ObjectId = string;

interface Card {
  id: ObjectId;
  favorite: boolean;
  name: string;
  phone: string;
  email: string;
  jobTitle: string;
  company: string;
  fields: CardField[];
  tags: ObjectId[];
}

interface Tag {
  id: ObjectId;
  label: string;
  color: string;
}

interface Settings {
  // TODO:
}

interface User {
  username: string;
  settings: Settings;
  cards: Card[];
  tags: Tag[];
}
```
