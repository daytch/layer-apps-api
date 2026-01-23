import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ParamGetAllData } from 'src/egg/dto/ParamsGetAllData.dto';

@ApiBearerAuth()
@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('FCRChart')
  async FCRChart(@Query() params: ParamGetAllData) {
    return this.dashboardService.FCRChart(params);
  }

  @Get()
  getAllData() {
    return this.dashboardService.getAllData();
  }
}
