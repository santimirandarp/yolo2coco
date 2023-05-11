import { readdirSync, readFileSync as rfs } from 'node:fs';
import { resolve, basename, dirname, join } from 'node:path';
import { parseAnnotation } from './parseAnnot';

import YAML from 'yaml';
import sizeOf from 'image-size';
import { cocoDatasetFormat as coco } from '../coco_default';
import {
  appendClassesToCoco,
  defaultAnnotationField,
  imageField,
} from '../coco_utils';

/**
 * Converts a yoloV5 dataset to a coco dataset
 * @param inputFile - path to the yoloV5 yaml file
 * @param compressed - if true, the output json will be minified, otherwise it will be pretty printed
 */
export function yoloV5ToCoco(pathToYAML = './data.yaml', compressed = true) {
  // get the yaml.keys
  pathToYAML = resolve(__dirname, pathToYAML);

  const {
    train,
    val,
    test,
    names: classes,
  } = YAML.parse(rfs(pathToYAML, 'utf8'));

  appendClassesToCoco(coco, classes);

  const baseDir = dirname(pathToYAML);
  const imgDirs = [train, val, test]
    .filter((x) => x)
    .map((x) => join(baseDir, x));

  for (const imgDir of imgDirs) {
    try {
      const imgPaths = readdirSync(imgDir).map((f) => join(imgDir, f));

      let nOfAnnots = 0;
      imgPaths.forEach((imgPath, i) => {
        const imageName = basename(imgPath);
        const { height, width }= sizeOf(imgPath);
        if (!height || !width) {
          throw new Error("Couldn't get image size for " + imgPath);
        }
        const imgField = imageField(i, imageName, { height, width });
        coco.images.push(imgField);
        const labelFile = imgPath
          .replace('/images/', '/labels/')
          .replace(/\.[^/.]+$/, '.txt');
        const lines = rfs(labelFile, 'utf8').split('\n');

        for (const line of lines) {

          const { rawCategory, bbox, area } = parseAnnotation(line, { width, height });
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
    } catch (e) {
      console.error(e);
    }
  }
  return JSON.stringify(coco, null, compressed ? 0 : 2);
}
