import { join } from 'node:path';

import { annotationSearch } from '../annotationSearch';

const yoloV4Pytorch = join(__dirname, '../../__tests__/data/yolov4Pytorch/');

const testDir = join(yoloV4Pytorch, 'test', '_annotations.txt');
const valid = join(yoloV4Pytorch, 'valid', '_annotations.txt');
const train = join(yoloV4Pytorch, 'train', '_annotations.txt');

it('test the paths found by the search function', async () => {
  const result = await annotationSearch(yoloV4Pytorch);
  [testDir, valid, train].forEach(
    (item: string) => {
      expect(result).toContain(item);
    },
  );
  expect(result).toHaveLength(3);
});
