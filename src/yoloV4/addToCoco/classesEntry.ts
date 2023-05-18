import { type CocoDatasetFormat } from '../../coco_default';
import { makeClassItem } from '../../items/classItem';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { pathExistOrThrow } from '../../path_exists';

export async function addClasses(
  coco: CocoDatasetFormat,
  annotationsPath: string,
) {
  const classesPath = join(dirname(annotationsPath), '_classes.txt');
  await pathExistOrThrow(classesPath);
  const classes = (await readFile(classesPath, 'utf8')).trim().split('\n');
  classes.forEach((name, id) => {
    coco.categories.push(makeClassItem(name, id));
  });
}
