import { defaultAnnotationEntry } from '../coco_utils';

export function makeAnnotationEntry(
  line: string,
  imageId: number,
  annotationId: number,
) {
  const [x1, y1, x2, y2, rawCategory] = line.split(',').map(Number.parseFloat);
  const w = x2 - x1;
  const h = y2 - y1;
  const category = rawCategory + 1;

  return {
    ...defaultAnnotationEntry(imageId, category, annotationId),
    bbox: [x1, y1, w, h],
    area: w * h,
  };
}
