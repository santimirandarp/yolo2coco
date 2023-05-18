import { join } from 'node:path';

import { annotationSearch } from '../annotationSearch';

describe('annotationSearch', () => {
  it('should return an array of paths to annotation files', async () => {
    const baseDirectoryPath = join(
      __dirname,
      '../../__tests__/data/yolov4Pytorch/',
    );
    const expected = [
      join(baseDirectoryPath, 'test', '_annotations.txt'),
      join(baseDirectoryPath, 'valid', '_annotations.txt'),
      join(baseDirectoryPath, 'train', '_annotations.txt'),
    ];
    const result = await annotationSearch(baseDirectoryPath);
    expect(result).toStrictEqual(expected);
  });
});
