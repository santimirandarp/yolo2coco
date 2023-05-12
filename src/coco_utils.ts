import { existsSync } from 'fs';

import { type CocoDatasetFormat } from './coco_default';

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

export function imageEntry(
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
export function allExist(args: string[] | string) {
  if (typeof args === 'string') {
    args = [args];
    for (const dir of args) {
      if (!existsSync(dir)) {
        return false
      }
    }
  }
  return true
}

export function appendClassesToCoco(
  coco: CocoDatasetFormat,
  classes: string[],
) {
  classes.forEach((name, i) => {
    coco.categories.push({
      id: i + 1,
      name: name.trim(),
      supercategory: 'none',
    });
  });
}
