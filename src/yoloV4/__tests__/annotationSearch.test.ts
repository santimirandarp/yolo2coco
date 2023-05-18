import { join } from 'node:path';

import { annotationSearch } from '../annotationSearch';

describe('annotationSearch', () => {
  it('should return an array of paths to annotation files', async () => {
    const baseDirectoryPath = join(
      __dirname,
      '../../__tests__/data/yolov4Pytorch/',
    );
    const test = join(baseDirectoryPath, 'test', '_annotations.txt')
    const valid = join(baseDirectoryPath, 'valid', '_annotations.txt')
    const train = join(baseDirectoryPath, 'train', '_annotations.txt')
    
    const result = await annotationSearch(baseDirectoryPath);
    expect(result).toContain(test);
    expect(result).toContain(valid);
    expect(result).toContain(train);
    expect(result).toHaveLength(3)
  });
});
