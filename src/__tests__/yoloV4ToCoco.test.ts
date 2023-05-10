import { CocoDatasetFormat } from '../coco_default';
import {readFileSync} from 'node:fs';
import { yoloV4ToCoco } from '../yoloV4ToCoco';
import { join } from 'node:path';

describe('yoloV4ToCoco', () => {
    const result = yoloV4ToCoco(join(__dirname,'data/yolov4Pytorch/valid'), false)
    const jsonResult = JSON.parse(result) as CocoDatasetFormat
    const cocoTruth = JSON.parse(readFileSync(join(__dirname,'data/coco/valid/_annotations.coco.json'), 'utf8')) as CocoDatasetFormat
  test('should run', () => {
    expect(result).toBeDefined();
  });
  test('high level check', () => {
    // compare the objects
    expect(jsonResult.images).toHaveLength(cocoTruth.images.length);
    expect(Object.keys(jsonResult)).toHaveLength(Object.keys(cocoTruth).length);
});
   test('should have the same number of images', () => {
    expect(jsonResult.images).toHaveLength(cocoTruth.images.length);
   })
   test('should have the same number of annotations', () => {
    expect(jsonResult.annotations).toHaveLength(cocoTruth.annotations.length);
   })
   test('should have the same number of categories', () => {
    // I do not think we need the class they add, could be a bug.
    expect(jsonResult.categories).toHaveLength(cocoTruth.categories.length-1);
   })
   test('compare image and annotation', () => {
    const {file_name,width,height, id} = jsonResult.images[0];
    const truthImage = cocoTruth.images.filter((img) => img.file_name === file_name)[0]
    expect(truthImage).toMatchObject({file_name,width,height})  
    const truthAnnotations = cocoTruth.annotations.filter((ann) => ann.image_id === truthImage.id) 
    const jsonAnnotations = jsonResult.annotations.filter((ann) => ann.image_id === id)
    expect(truthAnnotations).toHaveLength(jsonAnnotations.length)

    const {bbox:bboxTrue}= truthAnnotations[0]
    const {bbox}= jsonAnnotations[0]
    expect(bboxTrue[0]).toBeCloseTo(bbox[0])
    expect(bboxTrue[1]).toBeCloseTo(bbox[1])
    // box 2 differs by rounding only 
    expect(bboxTrue[3]).toBeCloseTo(bbox[3])

   })
});