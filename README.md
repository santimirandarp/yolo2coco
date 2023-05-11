# yolo2coco

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Basic Yolo-to-Coco conversion tool.

Currently it converts the YOLO v4,v5,v6,v7 and v8.


## Installation

```
npm i yolo2coco
```

## Usage

```typescript
import { yoloV4ToCoco, yoloV5ToCoco/* etc */ } from 'yolo2coco';

const {valid, train, test} = yoloV4ToCoco("./path/to/folder")

// const {val, train, test} = yoloV5ToCoco("./path/to/data.yaml")

```

## API Basics

<details>
<summary>See Here</summary>

The converters expect either:
* a path to the main directory (v4) 
* or a path to the `data.yaml` (v5-8) file.

They return an object with the keys `{ valid, train, test }` (v4) or `{ val, train, test }` (v5-8) with the Coco format.

You can then use `fs.writeFileSync("name.json", JSON.stringify(key))` to save the files.

</details>

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/yolo2coco.svg
[npm-url]: https://www.npmjs.com/package/yolo2coco
[ci-image]: https://github.com/santimirandarp/yolo2coco/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/santimirandarp/yolo2coco/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/santimirandarp/yolo2coco.svg
[codecov-url]: https://codecov.io/gh/santimirandarp/yolo2coco
[download-image]: https://img.shields.io/npm/dm/yolo2coco.svg
[download-url]: https://www.npmjs.com/package/yolo2coco
