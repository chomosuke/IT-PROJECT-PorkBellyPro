import { impl } from '../../controllers/CardField';

describe('CardField tests', () => {
  describe('fromRaw tests', () => {
    test('Success test', () => {
      const json = JSON.parse('{"key":"k","value":"v"}');
      const obj = impl.fromRaw(json);
      expect(obj.key).toBe('k');
      expect(obj.value).toBe('v');
    });

    test('Fail test: unexpected key type', () => {
      const json = JSON.parse('{"key":0,"value":"v"}');
      expect(() => impl.fromRaw(json)).toThrow();
    });

    test('Fail test: missing key', () => {
      const json = JSON.parse('{"value":"v"}');
      expect(() => impl.fromRaw(json)).toThrow();
    });

    test('Fail test: unexpected value type', () => {
      const json = JSON.parse('{"key":"k","value":0}');
      expect(() => impl.fromRaw(json)).toThrow();
    });

    test('Fail test: missing value', () => {
      const json = JSON.parse('{"key":"k"}');
      expect(() => impl.fromRaw(json)).toThrow();
    });

    test('Fail test: unexpected raw value', () => {
      const json = JSON.parse('[]');
      expect(() => impl.fromRaw(json)).toThrow();
    });
  });
});
