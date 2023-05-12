import { readdirSync, readFileSync } from 'node:fs';
import { basename, resolve, join } from 'node:path';

import glob from 'fast-glob';

import { type CocoDatasetFormat, cocoDatasetFormat } from '../coco_default';
import { makeClassEntry } from '../coco_utils';

import { readDataDirectory } from './read-data-directory';

/**
 * Converts YoloV4 labels to COCO labels
 * @param baseDir - path to the directory containing the train, valid, and test directories
 */
export function yoloV4ToCoco(baseDirectoryPath: string, merge = false) {
  const results: { [key: string]: CocoDatasetFormat } = {};
  baseDirectoryPath = resolve(baseDirectoryPath);

  if (!merge) {
    const imageDirectories = readdirSync(baseDirectoryPath, {
      withFileTypes: true,
    })
      .filter((d) => d.isDirectory())
      .map((x) => join(baseDirectoryPath, x.name));

    for (const currentDir of imageDirectories) {
      const coco = readDataDirectory(currentDir);
      if (coco) results[basename(currentDir)] = coco;
    }
  } else {
    const coco = cocoDatasetFormat();
    const allPaths = glob.sync(
      `${baseDirectoryPath}/**/{_annotations,_classes}.txt`,
    );
    const classPath = allPaths.filter((x) => x.endsWith('_classes.txt'))[0];
    const classes = readFileSync(classPath, 'utf8').split('\n');
    classes.forEach((name, id) => {
      coco.categories.push(makeClassEntry(name, id));
    });
  }
  return results;
}
