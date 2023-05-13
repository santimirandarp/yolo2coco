export function defaultAnnotationEntry(
  imageId: number,
  yoloCategory: number,
  annotationId: number,
) {
  return {
    id: annotationId,
    image_id: imageId,
    category_id: yoloCategory + 1,
    segmentation: [],
    area: 0,
    bbox: [0, 0, 0, 0],
    iscrowd: 0,
  };
}
