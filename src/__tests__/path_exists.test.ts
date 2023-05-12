import { join } from 'node:path';

import { allExist } from '../path_exists';

describe('allExist', () => {
  it('should return true if all paths exist', () => {
    const paths = [join(__dirname, 'path_exists.test.ts')];
    expect(allExist(paths)).toBe(true);
  });
  it('should return false if one path does not exist', () => {
    const paths = [join(__dirname, 'path_exists.ts')];
    expect(allExist(paths)).toBe(false);
  });
});
