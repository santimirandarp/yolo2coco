import { join } from 'node:path';

import { pathExistOrThrow } from '../path_exists';

describe('allExist', () => {
  it('should return true if all paths exist', async () => {
    const paths = [join(__dirname, 'path_exists.test.ts')];
    expect(await pathExistOrThrow(paths)).toBeUndefined();
  });
  it('should return false if one path does not exist', async() => {
    const paths = [join(__dirname, 'path_exists.ts')];
    expect(pathExistOrThrow(paths)).rejects.toThrow();
  });
});
