import { CocoDatasetFormat } from '../../coco_default';

import { addClasses } from './classesEntry';
import { addImagesAndAnnotationsEntry } from './imagesAndAnnotationsEntry';

export async function addAllEntries(
  coco: CocoDatasetFormat,
  annotationPath: string,
  annotationId?: number,
  imageId?: number,
) {
  return Promise.all([
    addClasses(coco, annotationPath),
    addImagesAndAnnotationsEntry(coco, annotationPath, annotationId, imageId),
  ]);
}
