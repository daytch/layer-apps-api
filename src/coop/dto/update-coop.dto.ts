import { PartialType } from '@nestjs/swagger';
import { CreateCoopDto } from './create-coop.dto';

export class UpdateCoopDto extends PartialType(CreateCoopDto) {}
