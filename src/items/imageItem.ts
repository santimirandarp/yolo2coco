import { CocoDatasetFormat } from '../coco_default';

/**
 * Creates an image item (item of coco.images array)
 * @param imageId
 * @param name
 * @param size
 * @returns
 */
export function makeImageItem(
  imageId: number,
  name: string,
  size: { width: number; height: number },
): CocoDatasetFormat['images'][0] {
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
