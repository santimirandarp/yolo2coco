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

export function makeImageEntry(
  imageId: number,
  name: string,
  size: { width: number; height: number },
) {
  return {
    id: imageId,
    license: 1,
    file_name: name,
    height: size.height,
    width: size.width,
    date_captured: '',
  };
}

export function makeClassEntry(name: string, id: number) {
  return {
    id: id + 1,
    name: name.trim(),
    supercategory: 'none',
  };
}
