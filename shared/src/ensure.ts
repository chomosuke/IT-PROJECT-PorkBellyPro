import type { TypeOfTag } from 'typescript';

export type AnyUnknown = { [k: string]: unknown };

export function ensureType(value: unknown, type: 'undefined'): undefined;
export function ensureType(value: unknown, type: 'number'): number;
export function ensureType(value: unknown, type: 'bigint'): bigint;
export function ensureType(value: unknown, type: 'boolean'): boolean;
export function ensureType(value: unknown, type: 'string'): string;
export function ensureType(value: unknown, type: 'symbol'): symbol;
export function ensureType(value: unknown, type: 'object'): AnyUnknown | null;
export function ensureType(value: unknown, type: 'function'): CallableFunction;

export function ensureType(value: unknown, type: TypeOfTag): unknown {
  if (typeof value !== type) throw new Error(`typeof value is not ${type}`);

  return value;
}

export function ensureObject(value: unknown): AnyUnknown {
  if (value == null) throw new Error('value is nullish');

  const ensured = ensureType(value, 'object');
  if (ensured == null) throw new Error('ensured is null');

  return ensured;
}

export function ensureArray(value: unknown): unknown[] {
  if (!(value instanceof Array)) throw new Error(`value is not instanceof ${Array.name}`);

  return value;
}

export function ensureNotNull<T>(value: T | null | undefined): T {
  if (value == null) throw new Error('value is nullish');
  return value;
}
