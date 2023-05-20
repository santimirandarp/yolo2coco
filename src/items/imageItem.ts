import { CocoDatasetFormat } from '../coco_default';

/**
 * Creates a `coco.images` array item.
 * @param imageId - the image id
 * @param name - the image name
 * @param size - the image size
 * @returns - a `coco.images` array item.
 */
export function makeImageItem(
  imageId: number,
  name: string,
  size: { width: number; height: number },
): CocoDatasetFormat['images'][number] {
  return {
    id: imageId,
    license: 1,
    file_name: name,
    height: size.height,
    width: size.width,
    date_captured: '',
    flickr_url: '',
    coco_url: '',
  };
}
