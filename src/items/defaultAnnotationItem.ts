/**
 * Default annotation item (from the `coco.annotations` array)
 * @param imageId - id of the image, given by the iteration process.
 * @param yoloCategory - category of the annotation.
 * @param annotationId - id of the annotation, given by the iteration process.
 * @returns 
 */
export function defaultAnnotationItem(
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
