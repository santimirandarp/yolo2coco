import { createReadStream } from 'node:fs';
import { dirname, join } from 'node:path';
import { createInterface } from 'node:readline';

import sizeOf from 'image-size';

import { CocoDatasetFormat } from '../../coco_default';
import { makeImageItem } from '../../items/imageItem';
import { makeAnnotationItem } from '../items/annotationItem';

/**
 * Adds all entries (annotations and images) to the COCO dataset. The may be
 * multiple annotations for each image.
 * @param coco - the coco object we are adding items to.
 * @param annotationsPath - the path to the annotations file.
 * @param annotationId - the annotation id to start from.
 * @param imageId - the image id to start from.
 * @returns - a tuple with the annotationId and imageId.
 */
export async function addImagesAndAnnotationsItem(
  coco: CocoDatasetFormat,
  annotationsPath: string,
  annotationId?: number,
  imageId?: number,
) {
  if (!annotationId) annotationId = 0;
  if (!imageId) imageId = 0;

  const annotationLines = createInterface({
    input: createReadStream(annotationsPath, 'utf-8'),
    crlfDelay: Infinity,
  });

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
      const newAnnotation = makeAnnotationItem(
        annotation,
        imageId,
        annotationId,
      );
      coco.annotations.push(newAnnotation);
      annotationId += 1;
    }
    imageId += 1;
  }
  return { imageId, annotationId };
}
