import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import sizeOf from 'image-size';

import { CocoDatasetFormat } from '../coco_default';
import { makeImageEntry } from '../entries/make_image_entry';

import { makeAnnotationEntry } from './make_annotation';

export function parseAnnotationsFile(
  coco: CocoDatasetFormat,
  annotationsPath: string,
  annotationId: number,
  imageId = 0,
) {
  const annotationLines = readFileSync(annotationsPath, 'utf8')
    .trim()
    .split('\n');

  annotationLines.forEach((line) => {
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
    imageId += 1;
  });
  return imageId;
}
