export function parseAnnotation(
  line: string,
  size: { width: number; height: number },
) {
  const { width: naturalWidth, height: naturalHeight } = size;
  const [rawCategory, xc, yc, w, h] = line.split(' ').map(Number.parseFloat);

  const scaledWidth = w * naturalWidth;
  const scaledHeight = h * naturalHeight;
  return {
    bbox: [
      (xc - w / 2) * naturalWidth,
      (yc - h / 2) * naturalHeight,
      scaledWidth,
      scaledHeight,
    ],
    area: scaledWidth * scaledHeight,
    rawCategory
  };
}
