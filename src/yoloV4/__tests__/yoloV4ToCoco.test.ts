import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { CocoDatasetFormat } from '../../coco_default';
import { yoloV4ToCoco } from '../yoloV4ToCoco';

const testPath = join(__dirname, '../../', '__tests__', 'data');
const yoloPath = join(testPath, 'yolov4Pytorch');
const cocoPath = join(testPath, 'coco/valid/_annotations.coco.json');

it('yolo2coco', async () => {
  const { all } = await yoloV4ToCoco(yoloPath, true);
  const { train, valid, test: testKey } = await yoloV4ToCoco(yoloPath, false);
  const cocoTrue = JSON.parse(
    readFileSync(cocoPath, 'utf8'),
  ) as CocoDatasetFormat;

  test('Merged coco versus separate-directory coco', () => {
    expect(all.images).toHaveLength(
      train.images.length + valid.images.length + testKey.images.length,
    );
    expect(all.annotations).toHaveLength(
      train.annotations.length +
        valid.annotations.length +
        testKey.annotations.length,
    );
  });
  test('IDS assigned to Images and Annotations.', () => {
    expect(all.images[all.images.length - 1].id).toBe(
      cocoTrue.images[cocoTrue.images.length - 1].id,
    );
    expect(all.annotations[all.annotations.length - 1].id).toBe(
      cocoTrue.annotations[cocoTrue.annotations.length - 1].id,
    );
  });
  test('Number of top-level keys, images, and annotations', () => {
    expect(Object.keys(valid)).toHaveLength(Object.keys(cocoTrue).length);
  });
  test('Number of images', () => {
    expect(valid.images).toHaveLength(cocoTrue.images.length);
  });
  test('Number of annotations', () => {
    expect(valid.annotations).toHaveLength(cocoTrue.annotations.length);
  });
  test('should have the same number of categories', () => {
    expect(valid.categories).toHaveLength(cocoTrue.categories.length - 1);
  });
  test('compare image and annotation and category id', () => {
    
    const { file_name, width, height, id } = valid.images[0];
    const trueImage = cocoTrue.images.filter((img) => {
      return img.file_name === file_name;
    });
    expect(trueImage[0]).toMatchObject({ file_name, width, height });

    const trueAnnotations = cocoTrue.annotations.filter(
      (ann) => ann.image_id === trueImage[0].id,
    );
    const jsonAnnotations = valid.annotations.filter(
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
