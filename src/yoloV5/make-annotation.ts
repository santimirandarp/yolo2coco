import { defaultAnnotationEntry } from '../coco_utils';

export function makeAnnotationEntry(
  line: string,
  size: { width: number; height: number },
  imageId: number,
  annotationId: number,
) {
  const { width: naturalWidth, height: naturalHeight } = size;
  const [rawCategory, xc, yc, w, h] = line.split(' ').map(Number.parseFloat);

  const x1 = (xc - w / 2) * naturalWidth;
  const y1 = (yc - h / 2) * naturalHeight;
  const scaledWidth = w * naturalWidth;
  const scaledHeight = h * naturalHeight;

  return {
    ...defaultAnnotationEntry(imageId, rawCategory + 1, annotationId),
    bbox: [x1, y1, scaledWidth, scaledHeight],
    area: scaledWidth * scaledHeight,
  };
}
