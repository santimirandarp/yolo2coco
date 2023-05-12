import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import sizeOf from 'image-size';

import { cocoDatasetFormat } from '../coco_default';
import { appendClassesToCoco, allExist, imageEntry } from '../coco_utils';
import { makeAnnotationEntry } from './make-annotation';

export function processImageDirectory(directoryPath: string) {
  let annotationId = 0;

  const annotationsPath = join(directoryPath, '_annotations.txt');
  const classesPath = join(directoryPath, '_classes.txt');

  if (!allExist([annotationsPath, classesPath])) {
    return null;
  }

  const coco = cocoDatasetFormat();

  const annotationLines = readFileSync(annotationsPath, 'utf8').split('\n');

  annotationLines.forEach((line, imageId) => {
    const [filename, ...annotations] = line.trim().split(' ');

    const imagePath = join(directoryPath, filename);
    const { width, height } = sizeOf(imagePath);

    if (!width || !height) {
      throw new Error(`Could not get image size for ${imagePath}`);
    }

    const entry = imageEntry(imageId, filename, { width, height });
    coco.images.push(entry);

    for (const annotation of annotations) {
      const newAnnotation = makeAnnotationEntry(
        annotation,
        imageId,
        annotationId,
      );
      coco.annotations.push(newAnnotation);
      annotationId += 1;
    }
  });

  const classes = readFileSync(classesPath, 'utf8').split('\n');
  appendClassesToCoco(coco, classes);
  return coco;
}
