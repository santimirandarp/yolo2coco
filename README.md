# yolo2coco

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Basic Yolo-to-Coco conversion tool. Converts YOLO v4-5-6-7-8.

```shell
npm install yolo2coco
```

## Usage

```typescript
import { yoloV4ToCoco, yoloV5ToCoco/* etc */ } from 'yolo2coco';

const {valid, train, test} = yoloV4ToCoco("./path/to/folder")

// const {val, train, test} = yoloV5ToCoco("./path/to/data.yaml")

```

## Details

They return an object with the keys `{ valid, train, test }` (v4) or `{ val, train, test }` (v5-8) with the Coco format.

If you pass the `merge` option to **yoloV4** it can also merge many directories into one.
 
You can use `fs.writeFileSync("name.json", JSON.stringify(result, null, indentation))` to write out.

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/yolo2coco.svg
[npm-url]: https://www.npmjs.com/package/yolo2coco
[ci-image]: https://github.com/santimirandarp/yolo2coco/workflows/Node.js%20CI/badge.svg?branch=master
[ci-url]: https://github.com/santimirandarp/yolo2coco/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/santimirandarp/yolo2coco.svg
[codecov-url]: https://codecov.io/gh/santimirandarp/yolo2coco
[download-image]: https://img.shields.io/npm/dm/yolo2coco.svg
[download-url]: https://www.npmjs.com/package/yolo2coco
