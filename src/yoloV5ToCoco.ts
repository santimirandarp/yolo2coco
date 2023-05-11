import { readdirSync, readFileSync as rfs } from 'node:fs';
import { resolve, basename, dirname, join } from 'node:path';

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
        const imageSize = sizeOf(imgPath);
        const imgField = imageField(i, imageName, imageSize);
        coco.images.push(imgField);

        const labelFile = imgPath
          .replace('/images/', '/labels/')
          .replace(/\.[^/.]+$/, '.txt');
        const lines = rfs(labelFile, 'utf8').split('\n');

        const naturalWidth = imageSize.width;
        const naturalHeight = imageSize.height;
        if (!naturalWidth || !naturalHeight)
          throw new Error(`Could not get image size for ${imgPath}`);

        for (const line of lines) {
          const [rawCategory, xc, yc, w, h] = line
            .split(' ')
            .map(Number.parseFloat);
          const annotationField = defaultAnnotationField(
            i,
            rawCategory + 1,
            nOfAnnots,
          );
          annotationField.bbox = [
            (xc - w / 2) * naturalWidth,
            (yc - h / 2) * naturalHeight,
            w * naturalWidth,
            h * naturalHeight,
          ];
          annotationField.area = w * h;
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
