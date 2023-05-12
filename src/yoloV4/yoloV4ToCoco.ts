import { readdirSync } from 'node:fs';
import { basename, resolve, join } from 'node:path';

import { type CocoDatasetFormat } from '../coco_default';

import { processImageDirectory } from './process-image-directory';

/**
 * Converts YoloV4 labels to COCO labels
 * @param baseDir - path to the directory containing the train, valid, and test directories
 */
export function yoloV4ToCoco(baseDirectoryPath: string) {
  const results: { [key: string]: CocoDatasetFormat } = {};
  baseDirectoryPath = resolve(baseDirectoryPath);

  const imageDirectories = readdirSync(baseDirectoryPath).map((x) =>
    join(baseDirectoryPath, x),
  );

  for (let currentDir of imageDirectories) {
    const coco = processImageDirectory(currentDir);
    if (coco) results[basename(currentDir)] = coco;
  }

  return results;
}
