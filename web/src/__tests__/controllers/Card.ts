import { Card } from '@porkbellypro/crm-shared';
import { fromRaw } from '../../controllers/Card';

type DeepReadonly<T> = T extends { [k in keyof T]: T[k] }
  ? { readonly [k in keyof T]: DeepReadonly<T[k]>; }
  : Readonly<T>;

describe('Card tests', () => {
  const template: DeepReadonly<Card> = {
    id: '000000000000000000000000',
    favorite: false,
    name: 'name',
    phone: 'phone',
    email: 'email',
    jobTitle: 'jobTitle',
    company: 'company',
    fields: [
      {
        key: 'Key 1',
        value: 'Value 1',
      },
      {
        key: 'Key 2',
        value: 'Value 2',
      },
    ],
    tags: [],
  };

  describe('fromRaw tests', () => {
    test('Success test: without image', () => {
      const obj = fromRaw(template);
      expect(obj).toMatchInlineSnapshot(`
Object {
  "company": "company",
  "email": "email",
  "favorite": false,
  "fields": Array [
    Object {
      "key": "Key 1",
      "value": "Value 1",
    },
    Object {
      "key": "Key 2",
      "value": "Value 2",
    },
  ],
  "id": "000000000000000000000000",
  "jobTitle": "jobTitle",
  "name": "name",
  "phone": "phone",
}
`);
    });

    test('Success test: with image', () => {
      const obj = fromRaw({
        ...template,
        imageHash: 'aHash',
      });
      expect(obj).toMatchInlineSnapshot(`
Object {
  "company": "company",
  "email": "email",
  "favorite": false,
  "fields": Array [
    Object {
      "key": "Key 1",
      "value": "Value 1",
    },
    Object {
      "key": "Key 2",
      "value": "Value 2",
    },
  ],
  "id": "000000000000000000000000",
  "image": "/api/image/aHash",
  "jobTitle": "jobTitle",
  "name": "name",
  "phone": "phone",
}
`);
    });

    describe('Fail tests', () => {
      Object
        .keys(template)
        // TODO: tags not implemented yet
        .filter((k) => k !== 'tags')
        .map((k0) => test(k0, () => {
          const fn = () => fromRaw(Object.fromEntries(Object
            .entries(template)
            .filter(([k1]) => k1 !== k0)));

          expect(fn).toThrow();
        }));
    });
  });
});
