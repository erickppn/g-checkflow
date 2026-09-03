import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  @ApiOperation({ summary: 'Get dashboard data' })
  @Get()
  async find() {
    return this.dashboardService.getDashboard();
  }
}

