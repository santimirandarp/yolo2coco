import { readdirSync, readFileSync } from 'node:fs';
import { basename, resolve, join } from 'node:path';

import glob from 'fast-glob';

import { type CocoDatasetFormat, cocoDatasetFormat } from '../coco_default';
import { makeClassEntry } from '../entries/make_class_entry';

import { parseAnnotationsFile } from './parse_annotations_file';
import { readDataDirectory } from './read_data_directory';

/**
 * Converts YoloV4 labels to COCO labels
 * @param baseDirectoryPath - path to the directory containing the train, valid, ..., directories
 * @param merge - whether to merge all the data directories into one dataset
 * @returns - a dictionary of CocoDatasetFormat objects, with the keys being the names of the data directories
 * In the case of `merge = true`, the key is `'all'`
 */
export function yoloV4ToCoco(baseDirectoryPath: string, merge = false) {
  const results: { [key: string]: CocoDatasetFormat } = {};
  baseDirectoryPath = resolve(baseDirectoryPath);

  if (!merge) {
    const dataDirectories = readdirSync(baseDirectoryPath, {
      withFileTypes: true,
    })
      .filter((d) => d.isDirectory())
      .map((x) => join(baseDirectoryPath, x.name));

    for (const currentDir of dataDirectories) {
      const coco = readDataDirectory(currentDir);
      if (coco) results[basename(currentDir)] = coco;
    }
    return results;
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
    const annotationFiles = allPaths.filter((x) =>
      x.endsWith('_annotations.txt'),
    );
    let annotationId = 0;
    for (const file of annotationFiles) {
      parseAnnotationsFile(coco, file, annotationId);
      annotationId += 1;
    }
    return { all: coco };
  }
}
