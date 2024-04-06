import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Res,
  Param,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../utils/file-upload.utils';
import { Public } from '../auth/constants';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { FileUploadDto } from './dto/fileUpload.dto';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of users',
    type: FileUploadDto,
  })
  async uploadedFile(@UploadedFile() file) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return response;
  }

  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './public/images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadMultipleFiles(@UploadedFiles() files) {
    const response = [];
    files.forEach((file) => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
      };
      response.push(fileReponse);
    });
    return response;
  }

  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: '/public/images' });
  }

  @Public()
  @Post('register')
  create(@Body() createUsersDto: CreateUsersDto) {
    return this.usersService.create(createUsersDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUsersDto: UpdateUsersDto) {
    return this.usersService.update(+id, updateUsersDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }

  @Get('/profile/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findProfile(+id);
  }
}
