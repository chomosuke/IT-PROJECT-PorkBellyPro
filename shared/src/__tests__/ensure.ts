import { ensureArray, ensureObject, ensureType } from '../ensure';

const map = {
  undefined,
  number: Number(),
  bigint: BigInt(Number()),
  boolean: Boolean(),
  string: String(),
  symbol: Symbol('symbol'),
  object: Object(),
  function() { },
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function asTypeTag(tag: string): any {
  return tag;
}

describe('ensure tests', () => {
  describe('ensureType tests', () => {
    describe('Success tests', () => {
      Object
        .entries(map)
        .forEach(([k, v]) => test(k, () => {
          expect(() => ensureType(v, asTypeTag(k))).not.toThrow();
        }));

      test('null', () => {
        expect(() => ensureType(null, 'object')).not.toThrow();
      });
    });

    describe('Fail tests', () => {
      Object
        .entries(map)
        .forEach(([k0, v]) => describe(k0, () => {
          Object
            .keys(map)
            .filter((k1) => k0 !== k1)
            .map((k1) => test(k1, () => {
              expect(() => ensureType(v, asTypeTag(k1))).toThrow();
            }));
        }));

      describe('null', () => {
        Object
          .keys(map)
          .filter((k) => k !== 'object')
          .map((k) => test(k, () => {
            expect(() => ensureType(null, asTypeTag(k))).toThrow();
          }));
      });
    });
  });

  describe('ensureObject tests', () => {
    test('Success test', () => {
      expect(() => ensureObject(Object())).not.toThrow();
    });

    describe('Fail tests', () => {
      Object
        .entries(map)
        .filter(([k]) => k !== 'object')
        .map(([k, v]) => test(k, () => {
          expect(() => ensureObject(v)).toThrow();
        }));
    });
  });

  describe('ensureArray tests', () => {
    test('Success test', () => {
      expect(() => ensureArray([])).not.toThrow();
    });

    describe('Fail tests', () => {
      Object
        .entries(map)
        .concat([['null', null]])
        .map(([k, v]) => test(k, () => {
          expect(() => ensureArray(v)).toThrow();
        }));
    });
  });
});
