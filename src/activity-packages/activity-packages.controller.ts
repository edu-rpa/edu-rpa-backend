import { Controller, Get } from '@nestjs/common';
import { ActivityPackagesService } from './activity-packages.service';

@Controller('activity-packages')
export class ActivityPackagesController {
  constructor(
    private readonly activityPackagesService: ActivityPackagesService
  ) {}

  @Get()
  async findAll() {
    return this.activityPackagesService.findAll();
  }
}
