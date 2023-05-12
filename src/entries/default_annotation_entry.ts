export function defaultAnnotationEntry(
  imageId: number,
  category: number,
  annotationId: number,
) {
  return {
    id: annotationId,
    image_id: imageId,
    category_id: category,
    segmentation: [],
    area: 0,
    bbox: [0, 0, 0, 0],
    iscrowd: 0,
  };
}
