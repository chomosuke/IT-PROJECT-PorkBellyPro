import type { Hashed } from './Hashed';

export interface RegisterRequest {
  username: string;
  password: Hashed;
}
