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
  Res,
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
import { join } from 'path';
import { Observable, of } from 'rxjs';

@ApiBearerAuth()
@ApiTags('Users')
@UseInterceptors(ErrorsInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('upload')
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
    description: 'Upload avatar profile',
    type: FileUploadDto,
  })
  async uploadedFile(@Req() req: Request, @UploadedFile() file) {
    const response = {
      path: `${req.protocol}://${req.get('Host')}/users/${file.filename}`,
    };
    return response;
  }

  @Public()
  @Get(':imagename')
  seeUploadedFile(
    @Param('imagename') imagename: string,
    @Res() res,
  ): Observable<object> {
    return of(res.sendFile(join(process.cwd(), 'public/images/' + imagename)));
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
