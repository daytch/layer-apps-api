import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  Body,
  Put,
  Delete,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../utils/file-upload.utils';
import { Public } from '../auth/constants';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { FileUploadDto } from './dto/fileUpload.dto';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { ErrorsInterceptor } from 'src/interceptors/errors.interceptor';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('Users')
@UseInterceptors(ErrorsInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './dist/public/images',
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
  async uploadedFile(@Req() req: Request, @UploadedFile() file) {
    const response = {
      path: `${req.protocol}://${req.get('Host')}/${file.filename}`,
    };
    return response;
  }

  @Public()
  @Post('register')
  create(@Body() createUsersDto: CreateUsersDto) {
    return this.usersService.create(createUsersDto);
  }

  @Put(':id')
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

  @Get()
  findAll() {
    return this.usersService.getAllUsers();
  }
}
