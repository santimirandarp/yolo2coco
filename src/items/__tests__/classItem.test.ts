import { makeClassItem } from '../classItem';

describe('makeClassEntry', () => {
  it('should return the correct object', () => {
    const name = 'test';
    const id = 0;
    const expected = {
      id: id + 1,
      name: name.trim(),
      supercategory: 'none',
    };
    const actual = makeClassItem(name, id);
    expect(actual).toStrictEqual(expected);
  });
});
