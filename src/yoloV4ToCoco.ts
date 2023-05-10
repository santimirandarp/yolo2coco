import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import sizeOf from 'image-size';
import {cocoDatasetFormat as coco } from './coco_default';
import { appendClassesToCoco,existOrThrow,defaultAnnotationField, imageField } from './coco_utils';

/**
 * Converts a yoloV4 dataset to a coco dataset
 * @param inputFile - path to the yoloV4 annotations file
 * @param compressed - if true, the output json will be minified, otherwise it will be pretty printed
 */
export function yoloV4ToCoco(
  inputDir = './train/',
  compressed=true
) {

  const annotationsPath = join(inputDir,"_annotations.txt")
  const classesPath = join(inputDir,"_classes.txt")

  existOrThrow([annotationsPath, classesPath]);

  const lines = readFileSync(annotationsPath, 'utf8').split('\n');
 
  let nOfAnnots = 0;
  lines.forEach((line, i) => {
    const [filename, ...annotations] = line.trim().split(' ');

    const imagePath = join(inputDir, filename);

    const imgField = imageField(i, filename, sizeOf(imagePath));
    coco.images.push(imgField);

    for (const annotation of annotations) {
      
      const [x1, y1, x2, y2, category] = annotation.split(',').map(Number.parseFloat);
      const w= x2 - x1;
      const h= y2 - y1;

      const annotationField = defaultAnnotationField(i, category, nOfAnnots);
      annotationField.bbox = [x1, y1, w, h];
      annotationField.area = w*h;
      coco.annotations.push(annotationField);
      nOfAnnots += 1;
    }
  })

  appendClassesToCoco(coco,classesPath);

  return JSON.stringify(coco, null, compressed ? 0 : 2);
}


