export interface CocoDatasetFormat {
    info: {
      description: string;
      url: string;
      version: string;
      year: number;
      contributor: string;
      date_created: string;
    };
    licenses: {
      url: string;
      id: number;
      name: string;
    }[];
    categories: {
      supercategory: string;
      id: number;
      name: string;
    }[];
    images: {
      id: number;
      license: number;
      file_name: string;
      height: number;
      width: number;
      date_captured: string;
    }[];
    annotations: {
      id: number;
      image_id: number;
      category_id: number;
      segmentation: number[][];
      area: number;
      bbox: number[];
      iscrowd: number;
    }[];
  }
  export const cocoDatasetFormat: CocoDatasetFormat = {
    info: {
      description: "COCO 2017 Dataset",
      url: "http://cocodataset.org",
      version: "1.0",
      year: 2017,
      contributor: "COCO Consortium",
      date_created: "2017/09/01",
    },
    licenses: [
      {
        url: "http://creativecommons.org/licenses/by-nc-sa/2.0/",
        id: 1,
        name: "Attribution-NonCommercial-ShareAlike License",
      },
    ],
    categories: [ ],
    images: [],
    annotations: [],
  };
  