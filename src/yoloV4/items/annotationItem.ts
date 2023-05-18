import { defaultAnnotationItem } from '../../items/defaultAnnotationItem';

export function makeAnnotationEntry(
  line: string,
  imageId: number,
  annotationId: number,
) {
  const [x1, y1, x2, y2, yoloCategory] = line.split(',').map(Number.parseFloat);
  const w = x2 - x1;
  const h = y2 - y1;

  return {
    ...defaultAnnotationItem(imageId, yoloCategory, annotationId),
    bbox: [x1, y1, w, h],
    area: w * h,
  };
}
