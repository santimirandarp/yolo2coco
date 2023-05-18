import { open } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import sizeOf from 'image-size';

import { CocoDatasetFormat } from '../../coco_default';
import { makeImageItem } from '../../items/imageItem';
import { makeAnnotationEntry } from '../items/annotationItem';

export async function addImagesAndAnnotationsEntry(
  coco: CocoDatasetFormat,
  annotationsPath: string,
  annotationId?: number,
  imageId?: number,
) {
  if (!annotationId) annotationId = 0;
  if (!imageId) imageId = 0;

  const annotationLines = (await open(annotationsPath, 'r')).readLines();

  for await (const line of annotationLines) {
    const [filename, ...annotations] = line.trim().split(' ');

    const imagePath = join(dirname(annotationsPath), filename);
    const { width, height } = sizeOf(imagePath);

    if (!width || !height) {
      throw new Error(`Could not get image size for ${imagePath}`);
    }

    const entry = makeImageItem(imageId, filename, { width, height });
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
  }
  return imageId;
}
