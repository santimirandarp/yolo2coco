import { basename, dirname } from 'node:path';

import { cocoDatasetFormat } from '../coco_default';
import { CocoDirs } from '../types';

import { addAllEntries } from './addToCoco/addAllEntries';
import { annotationSearch } from './annotationSearch';

/**
 * Converts YoloV4 labels to COCO labels
 * @param baseDirectoryPath - starts recursive search from this directory.
 * @param merge - whether to merge the coco datasets into one.
 * @returns - a dictionary of CocoDatasetFormat objects.
 * When `merge = true`, the key is `all`.
 */
export async function yoloV4ToCoco(baseDirectoryPath: string, merge = false) {
  const annotationPaths = await annotationSearch(baseDirectoryPath);

  if (!merge) {
    const directories: CocoDirs = {};
    for (const annotationPath of annotationPaths) {
      const coco = cocoDatasetFormat();
      await addAllEntries(coco, annotationPath);
      const key = basename(dirname(annotationPath));
      directories[key] = coco;
    }
    return directories;
  } else {
    let annotationId = 0;
    let imageId = 0;
    const coco = cocoDatasetFormat();

    for (const annotationPath of annotationPaths) {
      ({ imageId, annotationId } = await addAllEntries(
        coco,
        annotationPath,
        annotationId,
        imageId,
      ));
    }
    return { all: coco };
  }
}
