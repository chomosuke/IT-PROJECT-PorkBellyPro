import {
  createCipheriv, createDecipheriv, randomBytes,
} from 'crypto';
import { Types } from 'mongoose';

export interface Session {
  userId: Types.ObjectId;
  expires: Date;
}

export const sessionMaxAge = 604800000;

const ivLength = 16;

interface SessionSerialized {
  userId: string;
  expires: string;
}

export function encryptSession(secret: Readonly<Buffer>, session: Readonly<Session>): string {
  const serialized: SessionSerialized = {
    userId: session.userId.toString(),
    expires: session.expires.toISOString(),
  };
  const json = JSON.stringify(serialized);

  const iv = randomBytes(ivLength);
  const cipher = createCipheriv('aes256', secret, iv);

  const cipherTextBody = cipher.update(json);
  const cipherTextFinal = cipher.final();

  const buf = Buffer.alloc(iv.length + cipherTextBody.length + cipherTextFinal.length);
  iv.copy(buf);
  cipherTextBody.copy(buf, iv.length);
  cipherTextFinal.copy(buf, iv.length + cipherTextBody.length);

  const result = buf.toString('base64');
  return result;
}

export function decryptSession(secret: Readonly<Buffer>, token: string): Session {
  const buf = Buffer.from(token, 'base64');
  if (buf.length < ivLength) throw new Error('cipherText too short');

  const iv = buf.slice(undefined, ivLength);
  const cipherText = buf.slice(ivLength);
  const decipher = createDecipheriv('aes256', secret, iv);
  const clearTextBody = decipher.update(cipherText);
  const clearTextFinal = decipher.final();

  const jsonBuf = Buffer.alloc(clearTextBody.length + clearTextFinal.length);
  clearTextBody.copy(jsonBuf);
  clearTextFinal.copy(jsonBuf, clearTextBody.length);

  const json = jsonBuf.toString();
  const parsed = JSON.parse(json);
  if (typeof parsed.userId === 'string' && typeof parsed.expires === 'string') {
    const expires = new Date(parsed.expires);
    if (expires.getTime() - Date.now() <= sessionMaxAge) {
      const userId = Types.ObjectId(parsed.userId);
      return {
        userId,
        expires,
      };
    }
  }

  throw new Error('Invalid session');
}
