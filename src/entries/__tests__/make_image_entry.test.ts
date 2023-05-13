import { makeImageEntry } from '../make_image_entry';

describe('makeImageEntry', () => {
  it('should return the correct object', () => {
    const imageId = 0;
    const imageName = 'test.jpg';
    const dimensions = { height: 100, width: 100 };
    const expected = {
      id: imageId,
      file_name: imageName,
      height: dimensions.height,
      width: dimensions.width,
      license: 1,
      flickr_url: '',
      coco_url: '',
      date_captured: '',
    };
    const actual = makeImageEntry(imageId, imageName, dimensions);
    expect(actual).toStrictEqual(expected);
  });
});
