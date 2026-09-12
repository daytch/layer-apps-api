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
import { memoryStorage } from 'multer';
import { imageFileFilter } from '../utils/file-upload.utils';
import { Public } from '../auth/constants';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { FileUploadDto } from './dto/fileUpload.dto';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { ErrorsInterceptor } from '../interceptors/errors.interceptor';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('Users')
@UseInterceptors(ErrorsInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Public()
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB, sesuaikan kebutuhan
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload avatar profile',
    type: FileUploadDto,
  })
  async uploadedFile(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.cloudinaryService.uploadImage(file);

    return {
      path: result.secure_url,
    };
  }

  @Public()
  @Post('register')
  create(@Body() createUsersDto: CreateUsersDto) {
    return this.usersService.create(createUsersDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUsersDto: UpdateUsersDto,
  ) {
    return await this.usersService.update(+id, updateUsersDto);
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
