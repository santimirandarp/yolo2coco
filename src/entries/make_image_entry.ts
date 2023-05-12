import { CocoDatasetFormat } from "../coco_default";

export function makeImageEntry(
  imageId: number,
  name: string,
  size: { width: number; height: number; }
): CocoDatasetFormat["images"][0]{
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
