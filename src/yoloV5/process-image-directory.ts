import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

import sizeOf from 'image-size';

import { cocoDatasetFormat } from '../coco_default';
import { appendClassesToCoco, imageEntry } from '../coco_utils';

import { makeAnnotationEntry } from './make-annotation';

export function processImageDirectory(imgDir: string, classes: string[]) {
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
    const imgField = imageEntry(imageId, imageName, { height, width });
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
