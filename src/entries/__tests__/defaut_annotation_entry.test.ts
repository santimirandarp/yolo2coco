import { defaultAnnotationEntry } from '../default_annotation_entry';

describe('defaultAnnotationEntry', () => {
  it('should return the correct object', () => {
    const imageId = 0;
    const category = 0;
    const annotationId = 0;
    const expected = {
      id: annotationId,
      image_id: imageId,
      category_id: category,
      segmentation: [],
      area: 0,
      bbox: [0, 0, 0, 0],
      iscrowd: 0,
    };
    const actual = defaultAnnotationEntry(imageId, category, annotationId);
    expect(actual).toStrictEqual(expected);
  });
});
