import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { cocoDatasetFormat } from '../coco_default';
import { makeClassEntry } from '../entries/make_class_entry';
import { allExist } from '../path_exists';

import { parseAnnotationsFile } from './parse_annotations_file';

export function readDataDirectory(directoryPath: string) {
  let annotationId = 0;

  // get the data paths
  const annotationsPath = join(directoryPath, '_annotations.txt');
  const classesPath = join(directoryPath, '_classes.txt');
  if (!allExist([annotationsPath, classesPath])) return null;

  // create the coco default object
  const coco = cocoDatasetFormat();

  // add the classes to the coco object
  const classes = readFileSync(classesPath, 'utf8').trim().split('\n');
  classes.forEach((name, id) => {
    coco.categories.push(makeClassEntry(name, id));
  });

  // add the images and annotations entries to the coco object
  parseAnnotationsFile(coco, annotationsPath, annotationId);

  return coco;
}
