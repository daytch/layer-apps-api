import { PartialType } from '@nestjs/swagger';
import { CreateFeedsmedicineDto } from './create-feedsmedicine.dto';

export class UpdateFeedsmedicineDto extends PartialType(CreateFeedsmedicineDto) {}
