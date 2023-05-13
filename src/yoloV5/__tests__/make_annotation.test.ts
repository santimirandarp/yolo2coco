import { makeAnnotationEntry } from '../make_annotation';

describe('makeAnnotationEntry', () => {
  it('should return the correct object', () => {
    const annotationId = 0;
    const imageId = 0;
    const yoloCategory = 0;
    const bbox = [0, 0, 100, 100];
    const expected = {
      id: annotationId,
      image_id: imageId,
      category_id: yoloCategory + 1,
      segmentation: [],
      area: 10000,
      bbox,
      iscrowd: 0,
    };
    const actual = makeAnnotationEntry(
      '0 0.5 0.5 1 1',
      { width: 100, height: 100 },
      imageId,
      annotationId,
    );
    expect(actual).toStrictEqual(expected);
  });
});
