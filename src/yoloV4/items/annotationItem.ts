import { defaultAnnotationItem } from '../../items/defaultAnnotationItem';

/**
 * Make an annotation entry from a line of the annotation file
 * @param line - a line from the annotation file
 * @param imageId - the image id
 * @param annotationId - the annotation id
 * @returns - an annotation entry for the coco.annotations array.
 */
export function makeAnnotationItem(
  line: string,
  imageId: number,
  annotationId: number,
) {
  const [x1, y1, x2, y2, yoloCategory] = line.split(',').map(Number.parseFloat);
  const w = x2 - x1;
  const h = y2 - y1;

  return {
    ...defaultAnnotationItem(imageId, annotationId, yoloCategory),
    bbox: [x1, y1, w, h],
    area: w * h,
  };
}
