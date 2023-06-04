import { readFileSync } from "node:fs";
import { join } from "node:path";

import { type CocoDatasetFormat } from "../../coco_default";
import { yoloV5ToCoco } from "../yoloV5ToCoco";

const dataPath = join(__dirname, "../../", "__tests__", "data");
const yamlFile = "yolov5Pytorch/data.yaml";

const cocoTrue = JSON.parse(
  readFileSync(join(dataPath, "/coco/valid/_annotations.coco.json"), "utf8")
) as CocoDatasetFormat;
describe("yoloV5ToCoco", async () => {
  const jsonResult = (await yoloV5ToCoco(join(dataPath, yamlFile))).val;
  test("should return value", () => {
    expect(jsonResult).toBeDefined();
  });
  test("Number of top level keys", () => {
    expect(Object.keys(jsonResult)).toHaveLength(Object.keys(cocoTrue).length);
  });
  test("Number of images", () => {
    expect(jsonResult.images).toHaveLength(cocoTrue.images.length);
  });
  test("Last image ID", () => {
    expect(jsonResult.images[jsonResult.images.length - 1].id).toBe(
      cocoTrue.images[cocoTrue.images.length - 1].id
    );
  });
  test("Number of annotations", () => {
    expect(jsonResult.annotations).toHaveLength(cocoTrue.annotations.length);
  });
  test("Last annotation ID", () => {
    expect(jsonResult.annotations[jsonResult.annotations.length - 1].id).toBe(
      cocoTrue.annotations[cocoTrue.annotations.length - 1].id
    );
  });
  test("Number of categories", () => {
    const theyHaveExtraOne = cocoTrue.categories.length - 1;
    expect(jsonResult.categories).toHaveLength(theyHaveExtraOne);
  });
  test("Compare one same Image Item", () => {
    const { file_name, width, height, id } = jsonResult.images[0];
    const trueImage = cocoTrue.images.filter(
      (img) => img.file_name === file_name
    );
    expect(trueImage[0]).toMatchObject({ file_name, width, height });

    const trueAnnotations = cocoTrue.annotations.filter(
      (ann) => ann.image_id === trueImage[0].id
    );
    const jsonAnnotations = jsonResult.annotations.filter(
      (ann) => ann.image_id === id
    );

    const { bbox: bboxTrue, category_id: cidTrue } = trueAnnotations[0];
    const { bbox, category_id } = jsonAnnotations[0];
    expect(category_id).toBe(cidTrue);
    expect(bbox[0]).toBeCloseTo(bboxTrue[0], 0);
    expect(bbox[1]).toBeCloseTo(bboxTrue[1], 0);
    expect(bbox[2]).toBeCloseTo(bboxTrue[2]);
    expect(bbox[3]).toBeCloseTo(bboxTrue[3]);
  });
});
