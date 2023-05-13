import { CocoDatasetFormat } from '../coco_default';

export function makeClassEntry(
  name: string,
  id: number,
): CocoDatasetFormat['categories'][0] {
  return {
    id: id + 1,
    name: name.trim(),
    supercategory: 'none',
  };
}
