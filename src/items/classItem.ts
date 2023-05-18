import { CocoDatasetFormat } from '../coco_default';

/**
 * Creates a class item (for the coco.class array).
 * @param name - name of the class.
 * @param id - id of the class given by the iteration process.
 * @returns a class item for the coco dataset, to be pushed to the array `classes`
 */
export function makeClassItem(
  name: string,
  id: number,
): CocoDatasetFormat['categories'][0] {
  return {
    id: id + 1,
    name: name.trim(),
    supercategory: 'none',
  };
}
