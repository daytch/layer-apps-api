import { extname } from 'path';
import { randomstring } from '../utils/randomizer.utils';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const docFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(xlsx|xls)$/)) {
    return callback(new Error('Only spread sheet files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const fileExtName = extname(file.originalname);
  const randomName = randomstring(12);
  callback(null, `${randomName}${fileExtName}`);
};
