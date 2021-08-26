import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { ObjectId, Schema } from 'mongoose';

export interface Session {
  userId: ObjectId;
  expires: Date;
}

export const sessionMaxAge = 604800000;

const ivLength = 16;

export function encryptSession(secret: Readonly<Buffer>, session: Readonly<Session>): string {
  const iv = randomBytes(ivLength);
  const json = JSON.stringify(session);
  const cipher = createCipheriv('aes256', secret, iv)
    .update(json);
  const buf = Buffer.alloc(cipher.length + iv.length);
  iv.copy(buf);
  cipher.copy(buf, iv.length);
  return buf.toString('base64');
}

export function decryptSession(secret: Readonly<Buffer>, cipherText: string): Session {
  const buf = Buffer.from(cipherText, 'base64');
  if (buf.length < 16) throw new Error('cipherText too short');

  const iv = buf.slice(undefined, 16);
  const cipher = buf.slice(16);
  const json = createDecipheriv('aes256', secret, iv)
    .update(cipher)
    .toString();
  const parsed = JSON.parse(json);
  if (typeof parsed.userId === 'string' && parsed.expires === 'string') {
    const expires = new Date(parsed.expires);
    if (expires.getTime() - Date.now() < sessionMaxAge) {
      const userId = new Schema.Types.ObjectId(parsed.userId);
      return {
        userId,
        expires,
      };
    }
  }

  throw new Error('Invalid session');
}
