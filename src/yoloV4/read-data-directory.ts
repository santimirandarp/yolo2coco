import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import sizeOf from 'image-size';

import { CocoDatasetFormat, cocoDatasetFormat } from '../coco_default';
import { makeClassEntry, makeImageEntry } from '../coco_utils';
import { allExist } from '../path-exists';

import { makeAnnotationEntry } from './make-annotation';

export function readDataDirectory(directoryPath: string) {
  let annotationId = 0;

  // get the data paths
  const annotationsPath = join(directoryPath, '_annotations.txt');
  const classesPath = join(directoryPath, '_classes.txt');
  if (!allExist([annotationsPath, classesPath])) return null;

  // create the coco default object
  const coco = cocoDatasetFormat();

  // add the classes to the coco object
  const classes = readFileSync(classesPath, 'utf8').split('\n');
  classes.forEach((name, id) => {
    coco.categories.push(makeClassEntry(name, id));
  });

  // add the images and annotations entries to the coco object
  parseAnnotationsFile(coco, annotationsPath, annotationId);

  return coco;
}

export function parseAnnotationsFile(
  coco: CocoDatasetFormat,
  annotationsPath: string,
  annotationId: number,
) {
  const annotationLines = readFileSync(annotationsPath, 'utf8').split('\n');

  annotationLines.forEach((line, imageId) => {
    const [filename, ...annotations] = line.trim().split(' ');

    const imagePath = join(dirname(annotationsPath), filename);
    const { width, height } = sizeOf(imagePath);

    if (!width || !height) {
      throw new Error(`Could not get image size for ${imagePath}`);
    }

    const entry = makeImageEntry(imageId, filename, { width, height });
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
  return coco;
}
