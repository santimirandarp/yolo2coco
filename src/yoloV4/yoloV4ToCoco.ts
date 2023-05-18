import { basename, dirname } from 'node:path';

import { type CocoDatasetFormat, cocoDatasetFormat } from '../coco_default';

import { addAllEntries } from './addToCoco/addAllEntries';
import { annotationSearch } from './annotationSearch';

/**
 * Converts YoloV4 labels to COCO labels
 * @param baseDirectoryPath - starts recursive search from this directory.
 * @param merge - whether to merge all the data directories into one dataset
 * @returns - a dictionary of CocoDatasetFormat objects.
 * When `merge = true`, the key is `'all'`
 */
export async function yoloV4ToCoco(baseDirectoryPath: string, merge = false) {
  const results: { [key: string]: CocoDatasetFormat } = {};
  const annotationPaths = await annotationSearch(baseDirectoryPath);

  if (!merge) {
    for (const annotationPath of annotationPaths) {
      const coco = cocoDatasetFormat();
      await addAllEntries(coco, annotationPath);
      const key = basename(dirname(annotationPath));
      results[key] = coco;
    }
    return results;
  } else {
    let annotationId = 0;
    let imageId = 0;
    const coco = cocoDatasetFormat();

    for (const annotationPath of annotationPaths) {
      await addAllEntries(coco, annotationPath, annotationId, imageId);
    }
    return { all: coco };
  }
}
