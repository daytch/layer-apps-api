import { HttpException, HttpStatus } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const greenCol = [
  'F',
  'G',
  'H',
  'J',
  'L',
  'M',
  'N',
  'O',
  'Q',
  'R',
  'S',
  'Y',
];

export const multerConfig = {
  dest: process.env.UPLOAD_LOCATION || './public/docs',
};
export const SUPPORTED_FILES = ['xlsx', 'xls'];
const PATH_DOWNLOADED_FILE = './public/docs';
export const multerOptions = {
  limits: {
    fileSize: +process.env.MAX_FILE_SIZE || 1024 * 1024,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const ext: string = file.originalname.split('.').pop() || '';
    if (SUPPORTED_FILES.indexOf(ext?.toLowerCase()) !== -1) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    /* Destination storage path details */
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = multerConfig.dest;
      /* Create folder if doesn't exist */
      if (!existsSync(PATH_DOWNLOADED_FILE)) {
        mkdirSync(PATH_DOWNLOADED_FILE);
      }
      cb(null, PATH_DOWNLOADED_FILE);
    },
    /* File modification details */
    filename: (req: any, file: any, cb: any) => {
      /* Calling the callback passing the random name generated with the original extension name */
      cb(null, `${file.originalname}`);
    },
  }),
};
