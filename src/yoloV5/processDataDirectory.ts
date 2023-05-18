import { readdir, open } from 'node:fs/promises';
import { basename, join } from 'node:path';

import sizeOf from 'image-size';

import { cocoDatasetFormat } from '../coco_default';
import { makeClassItem } from '../items/classItem';
import { makeImageItem } from '../items/imageItem';

import { makeAnnotationEntry } from './makeAnnotation';

export async function processDataDirectory(imgDir: string, classes: string[]) {
  let annotationId = 0;
  let imageId = 0;

  const coco = cocoDatasetFormat();
  classes.forEach((name, id) => {
    coco.categories.push(makeClassItem(name, id));
  });

  const imgPaths = (await readdir(imgDir)).map((f) => join(imgDir, f));
  for (const imgPath of imgPaths) {
    const imageName = basename(imgPath);
    const { height, width } = sizeOf(imgPath);
    if (!height || !width) {
      throw new Error(`Couldn't get image size for ${imgPath}`);
    }
    const imgField = makeImageItem(imageId, imageName, { height, width });
    coco.images.push(imgField);

    const labelFile = imgPath
      .replace('/images/', '/labels/')
      .replace(/\.[^/.]+$/, '.txt');
    const annotationLines = (await open(labelFile, 'r')).readLines();

    for await (const line of annotationLines) {
      const annotationEntry = makeAnnotationEntry(
        line,
        { width, height },
        imageId,
        annotationId,
      );
      coco.annotations.push(annotationEntry);
      annotationId += 1;
    }
    imageId += 1;
  }
  return coco;
}
