import { join } from 'node:path';

import { pathExistOrThrow } from '../pathExists';

describe('allExist', () => {
  it('should return true if all paths exist', async () => {
    const paths = join(__dirname, 'pathExists.test.ts');
    expect(await pathExistOrThrow(paths)).toBeUndefined();
  });
  it('should return false if one path does not exist', async () => {
    const paths = [join(__dirname, 'pathExists.ts')];
    await expect(pathExistOrThrow(paths)).rejects.toThrow();
  });
  
})
