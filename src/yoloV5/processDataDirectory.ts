import { createReadStream } from 'node:fs';
import { opendir } from 'node:fs/promises';
import { join } from 'node:path';
import { createInterface } from 'node:readline';

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

  const imgDirents = await opendir(imgDir);
  for await (const imgDirent of imgDirents) {
    const { name: imageName } = imgDirent;
    // will be removed in the future (node 20 supports `.path`)
    const imagePath = join(imgDir, imageName);

    const { height, width } = sizeOf(imagePath);
    if (!height || !width) {
      throw new Error(`Couldn't get image size for ${imgDirent.name}`);
    }
    const imgField = makeImageItem(imageId, imageName, { height, width });
    coco.images.push(imgField);

    const labelFile = imagePath
      .replace('/images/', '/labels/')
      .replace(/\.[^/.]+$/, '.txt');
    const annotationLines = createInterface({
      input: createReadStream(labelFile, 'utf-8'),
      crlfDelay: Infinity,
    });

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
