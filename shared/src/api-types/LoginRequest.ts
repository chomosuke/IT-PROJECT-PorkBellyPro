import type { Hashed } from './Hashed';

export interface LoginRequest {
  username: string;
  password: Hashed;
}
