import { readdirSync, readFileSync as rfs } from 'node:fs';
import { basename, resolve, dirname, join } from 'node:path';

import YAML from 'yaml';
import sizeOf from 'image-size';
import { cocoDatasetFormat as coco } from './coco_default';
import {
  appendClassesToCoco,
  defaultAnnotationField,
  imageField,
} from './coco_utils';

/**
 * Converts a yoloV5 dataset to a coco dataset
 * @param inputFile - path to the yoloV5 yaml file
 * @param compressed - if true, the output json will be minified, otherwise it will be pretty printed
 */
export function yoloV5ToCoco(pathToYAML = './data.yaml', compressed = true) {
  // get the yaml.keys
  pathToYAML = resolve(pathToYAML);
  const { train, val, test, classes } = YAML.parse(rfs(pathToYAML, 'utf8'));

  appendClassesToCoco(coco, classes);

  const baseDir = dirname(pathToYAML);
  const imgDirs = [train, val, test]
    .filter((x) => x)
    .map((x) => join(baseDir, x, 'images'));

  for (const imgDir of imgDirs) {
    const imgPaths = readdirSync(imgDir).map((f) => join(imgDir,f));

    let nOfAnnots = 0;
    imgPaths.forEach((imgPath, i) => {
      const imageName = basename(imgPath);
      const imgField = imageField(i, imageName, sizeOf(imgPath));
      coco.images.push(imgField);

      const labelFile = imgPath.replace(/\.[^/.]+$/, '.txt');
      const lines = rfs(labelFile, 'utf8').split('\n')
      for (const line of lines) {
        const [category, xc, yc, w, h] = line.split(' ').map(Number.parseFloat);
        const annotationField = defaultAnnotationField(i, category, nOfAnnots);
        annotationField.bbox = [xc - w / 2, yc - h / 2, w, h];
        annotationField.area = w * h;
        coco.annotations.push(annotationField);
        nOfAnnots += 1;
      }
    });
  }
  return JSON.stringify(coco, null, compressed ? 0 : 2);
}
