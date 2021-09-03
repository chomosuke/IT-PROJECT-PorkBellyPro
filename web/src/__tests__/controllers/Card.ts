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
    hasImage: false,
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
    test('Success test', () => {
      const obj = fromRaw(template);
      expect(obj).toMatchInlineSnapshot(`
RawCard {
  "company": "company",
  "email": "email",
  "favorite": false,
  "fields": Array [
    RawCardField {
      "key": "Key 1",
      "value": "Value 1",
    },
    RawCardField {
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
