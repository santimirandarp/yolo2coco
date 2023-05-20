import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import YAML from 'yaml';

import { CocoDirs } from '../types';

import { processDataDirectory } from './processDataDirectory';
/**
 * Converts YoloV5 to COCO.
 * @param inputFile - path to the YoloV5 yaml file
 */
export async function yoloV5ToCoco(pathToYAML: string) {
  const {
    train,
    val,
    test,
    names: classes,
  } = YAML.parse(await readFile(pathToYAML, 'utf8'));

  const results: CocoDirs = {};
  const baseDir = dirname(pathToYAML);

  for (const [key, imgDir] of Object.entries({ train, val, test })) {
    if (!key || !imgDir) continue;
    const coco = await processDataDirectory(join(baseDir, imgDir), classes);
    results[key] = coco;
  }
  return results;
}
