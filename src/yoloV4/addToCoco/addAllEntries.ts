import { CocoDatasetFormat } from '../../coco_default';

import { addClasses } from './classesEntry';
import { addImagesAndAnnotationsItem } from './imagesAndAnnotationsItem';

/**
 * Adds all entries (annotations and images) to the COCO dataset.
 * @param coco - the COCO default object.
 * @param annotationPath - the path to the annotation file.
 * @param annotationId - the annotation id to start from.
 * @param imageId - the image id to start from.
 * @returns - a tuple with the annotationId and imageId.
 */
export async function addAllEntries(
  coco: CocoDatasetFormat,
  annotationPath: string,
  annotationId?: number,
  imageId?: number,
) {
  await addClasses(coco, annotationPath);
  return addImagesAndAnnotationsItem(
    coco,
    annotationPath,
    annotationId,
    imageId,
  );
}
