# yolo2coco

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

The goal is to make some basic data handling easier for the manipulation of bounding box labels.

Especially Yolo formats are normally quite easy to merge, but then many model tools expect 
Coco format. 

This is a Basic Yolo-to-Coco conversion tool.

## Installation

`npm i yolo2coco`

## Usage

```typescript
import { yoloV4ToCoco } from 'yolo2coco';
import { join } from 'path';

// path to the **folder** with the _annotations.txt and _classes.txt files.
const yoloFolder = join(__dirname,'./train/')

const cocoJSON = yoloV4ToCoco(yoloFolder)
/* write out if you need
 * `writeFileSync('coco.json', JSON.stringify(coco))`
 */

```

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
