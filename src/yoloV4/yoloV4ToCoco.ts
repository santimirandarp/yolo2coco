import { readdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

import sizeOf from 'image-size';

import { type CocoDatasetFormat, cocoDatasetFormat } from '../coco_default';
import {
  appendClassesToCoco,
  existOrThrow,
  defaultAnnotationField,
  imageField,
} from '../coco_utils';

/**
 * Converts a yoloV4 dataset to a coco dataset
 * @param baseDir - path to the directory containing the train, valid, and test directories
 * * If you have different ones just rename it
 * * If some are missing that is fine.
 */
export function yoloV4ToCoco(baseDir = './yoloDataDir/') {
  const results: { [key: string]: CocoDatasetFormat } = {};
  baseDir = resolve(__dirname, baseDir);

  const dirs = readdirSync(baseDir).filter(
    (d) => d.endsWith('valid') || d.endsWith('train') || d.endsWith('test'),
  );
  const imgDirs = dirs.map((x) => join(baseDir, x));

  for (let i = 0; i < imgDirs.length; i++) {
    const thisDir = imgDirs[i];

    const annotationsPath = join(thisDir, '_annotations.txt');
    const classesPath = join(thisDir, '_classes.txt');
    existOrThrow([annotationsPath, classesPath]);

    const coco = cocoDatasetFormat();

    const lines = readFileSync(annotationsPath, 'utf8').split('\n');

    let nOfAnnots = 0;
    lines.forEach((line, i) => {
      const [filename, ...annotations] = line.trim().split(' ');

      const imagePath = join(thisDir, filename);
      const { width, height } = sizeOf(imagePath);
      if (!width || !height)
        throw new Error(`Could not get image size for ${imagePath}`);
      const imgField = imageField(i, filename, { width, height });
      coco.images.push(imgField);

      for (const annotation of annotations) {
        const [x1, y1, x2, y2, rawCategory] = annotation
          .split(',')
          .map(Number.parseFloat);
        const w = x2 - x1;
        const h = y2 - y1;

        const category = rawCategory + 1;
        const annotationField = defaultAnnotationField(i, category, nOfAnnots);
        annotationField.bbox = [x1, y1, w, h];
        annotationField.area = w * h;
        coco.annotations.push(annotationField);
        nOfAnnots += 1;
      }
    });

    const classes = readFileSync(classesPath, 'utf8').split('\n');
    appendClassesToCoco(coco, classes);
    results[dirs[i]] = coco;
  }
  return results;
}
