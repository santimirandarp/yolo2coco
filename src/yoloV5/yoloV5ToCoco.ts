import { readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';

import YAML from 'yaml';

import { CocoDatasetFormat } from '../coco_default';

import { processImageDirectory } from './process-image-directory';
/**
 * Converts a yoloV5 dataset to a coco dataset
 * @param inputFile - path to the yoloV5 yaml file
 */
export function yoloV5ToCoco(pathToYAML: string) {
  // get the yaml.keys
  pathToYAML = resolve(pathToYAML);
  const {
    train,
    val,
    test,
    names: classes,
  } = YAML.parse(readFileSync(pathToYAML, 'utf8'));

  const results: { [key: string]: CocoDatasetFormat } = {};
  const baseDir = dirname(pathToYAML);

  for (let [key, imgDir] of Object.entries({ train, val, test })) {
    if (!key || !imgDir) continue;
    imgDir = join(baseDir, imgDir);
    const coco = processImageDirectory(imgDir, classes);
    results[key] = coco;
  }
  return results;
}
