import { readdirSync, readFileSync as rfs } from 'node:fs';
import { resolve, basename, dirname, join } from 'node:path';

import sizeOf from 'image-size';
import YAML from 'yaml';

import { CocoDatasetFormat, cocoDatasetFormat } from '../coco_default';
import {
  appendClassesToCoco,
  defaultAnnotationField,
  imageField,
} from '../coco_utils';

import { parseAnnotation } from './parseAnnot';

/**
 * Converts a yoloV5 dataset to a coco dataset
 * @param inputFile - path to the yoloV5 yaml file
 */
export function yoloV5ToCoco(pathToYAML = './data.yaml') {
  // get the yaml.keys
  pathToYAML = resolve(__dirname, pathToYAML);
  const {
    train,
    val,
    test,
    names: classes,
  } = YAML.parse(rfs(pathToYAML, 'utf8'));

  const results: { [key: string]: CocoDatasetFormat } = {};
  const baseDir = dirname(pathToYAML);
  const imgDirs = [train, val, test]
    .filter((x) => x)
    .map((x) => join(baseDir, x));

  for (let i = 0; i < imgDirs.length; i++) {
    const imgDir = imgDirs[i];
    try {
      const coco = cocoDatasetFormat();
      appendClassesToCoco(coco, classes);
      const imgPaths = readdirSync(imgDir).map((f) => join(imgDir, f));

      let nOfAnnots = 0;
      imgPaths.forEach((imgPath, i) => {
        const imageName = basename(imgPath);
        const { height, width } = sizeOf(imgPath);
        if (!height || !width) {
          throw new Error(`Couldn't get image size for ${imgPath}`);
        }
        const imgField = imageField(i, imageName, { height, width });
        coco.images.push(imgField);
        const labelFile = imgPath
          .replace('/images/', '/labels/')
          .replace(/\.[^/.]+$/, '.txt');
        const lines = rfs(labelFile, 'utf8').split('\n');

        for (const line of lines) {
          const { rawCategory, bbox, area } = parseAnnotation(line, {
            width,
            height,
          });
          const annotationField = defaultAnnotationField(
            i,
            rawCategory + 1,
            nOfAnnots,
          );
          annotationField.bbox = bbox;
          annotationField.area = area;
          coco.annotations.push(annotationField);
          nOfAnnots += 1;
        }
      });
      if (i === 0) {
        results.train = coco;
      } else if (i === 1) {
        results.val = coco;
      } else {
        results.test = coco;
      }
    } catch (e) {
      console.error(e);
    }
  }
  return results;
}
