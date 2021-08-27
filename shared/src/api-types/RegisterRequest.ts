import type { Hashed } from './Hashed';

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
interface RegisterRequest {
  username: string;
  password: Hashed;
}
