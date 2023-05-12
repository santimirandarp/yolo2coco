import { readdirSync, readFileSync } from 'node:fs';
import { resolve, basename, dirname, join } from 'node:path';

import sizeOf from 'image-size';
import YAML from 'yaml';

import { CocoDatasetFormat, cocoDatasetFormat } from '../coco_default';
import { appendClassesToCoco, imageField } from '../coco_utils';
import { makeAnnotationEntry } from './make-annotation';

/**
 * Converts a yoloV5 dataset to a coco dataset
 * @param inputFile - path to the yoloV5 yaml file
 */
export function yoloV5ToCoco(pathToYAML = './data.yaml') {
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
    const coco = processImageDirectory(imgDir, classes, baseDir);
    results[key] = coco;
  }
  return results;
}

function processImageDirectory(
  imgDir: string,
  classes: string[],
  baseDir: string,
) {
  let annotationId = 0;

  const coco = cocoDatasetFormat();
  appendClassesToCoco(coco, classes);

  const imgPaths = readdirSync(imgDir).map((f) => join(imgDir, f));

  imgPaths.forEach((imgPath, imageId) => {
    const imageName = basename(imgPath);
    const { height, width } = sizeOf(imgPath);
    if (!height || !width) {
      throw new Error(`Couldn't get image size for ${imgPath}`);
    }
    const imgField = imageField(imageId, imageName, { height, width });
    coco.images.push(imgField);
    const labelFile = imgPath
      .replace('/images/', '/labels/')
      .replace(/\.[^/.]+$/, '.txt');
    const annotationLines = readFileSync(labelFile, 'utf8').split('\n');

    for (const line of annotationLines) {
      const annotationEntry = makeAnnotationEntry(
        line,
        { width, height },
        imageId,
        annotationId,
      );
      coco.annotations.push(annotationEntry);
      annotationId += 1;
    }
  });
  return coco;
}
