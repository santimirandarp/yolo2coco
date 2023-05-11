import { existsSync } from 'fs';

import { type CocoDatasetFormat } from './coco_default';

export function defaultAnnotationField(
  imageId: number,
  category: number,
  nOfAnnots: number,
) {
  return {
    id: nOfAnnots,
    image_id: imageId,
    category_id: category,
    segmentation: [],
    area: 0,
    bbox: [0, 0, 0, 0],
    iscrowd: 0,
  };
}

export function imageField(
  i: number,
  name: string,
  size: { width: number; height: number },
) {
  return {
    id: i,
    license: 1,
    file_name: name,
    height: size.height ,
    width: size.width ,
    date_captured: '',
  };
}
export function existOrThrow(args: string[] | string) {
  if (typeof args === 'string') {
    args = [args];
    for (const dir of args) {
      if (!existsSync(dir)) {
        throw new Error(`The file or directory ${dir} does not exist.`);
      }
    }
  }
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
