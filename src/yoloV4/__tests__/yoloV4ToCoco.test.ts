import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { CocoDatasetFormat } from '../../coco_default';
import { yoloV4ToCoco } from '../yoloV4ToCoco';

const testPath = join(__dirname, '../../', '__tests__', 'data');
describe('yolo2coco', () => {
  const jsonResult = yoloV4ToCoco(join(testPath, 'yolov4Pytorch'), false).valid;
  const cocoTrue = JSON.parse(
    readFileSync(join(testPath, 'coco/valid/_annotations.coco.json'), 'utf8'),
  ) as CocoDatasetFormat;
  test('should return value', () => {
    expect(jsonResult).toBeDefined();
  });
  test('Number of keys, images, and annotations', () => {
    expect(Object.keys(jsonResult)).toHaveLength(Object.keys(cocoTrue).length);
    expect(jsonResult.images).toHaveLength(cocoTrue.images.length);
    expect(jsonResult.annotations).toHaveLength(cocoTrue.annotations.length);
  });
  test('should have the same number of categories', () => {
    // I do not think we need the class they add, could be a bug.
    expect(jsonResult.categories).toHaveLength(cocoTrue.categories.length - 1);
  });
  test('compare image and annotation and category id', () => {
    // compare an image
    const { file_name, width, height, id } = jsonResult.images[0];
    const trueImage = cocoTrue.images.filter((img) => {
      return img.file_name === file_name;
    });
    expect(trueImage[0]).toMatchObject({ file_name, width, height });

    // compare an annotation
    const trueAnnotations = cocoTrue.annotations.filter(
      (ann) => ann.image_id === trueImage[0].id,
    );
    const jsonAnnotations = jsonResult.annotations.filter(
      (ann) => ann.image_id === id,
    );

    const { bbox: bboxTrue, category_id: cidTrue } = trueAnnotations[0];
    const { bbox, category_id } = jsonAnnotations[0];
    expect(category_id).toBe(cidTrue);
    expect(bbox[0]).toBeCloseTo(bboxTrue[0]);
    expect(bbox[1]).toBeCloseTo(bboxTrue[1]);
    expect(bbox[2]).toBeCloseTo(bboxTrue[2]);
    expect(bbox[3]).toBeCloseTo(bboxTrue[3]);
  });
});