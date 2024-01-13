import { Controller, Get } from '@nestjs/common';
import { ActivityPackagesService } from './activity-packages.service';
import { ActivityPackage } from './schema/activity-package.schema';
import { ApiTags, ApiBearerAuth, ApiResponse, getSchemaPath } from '@nestjs/swagger';

@Controller('activity-packages')
@ApiTags('activity-packages')
@ApiBearerAuth()
export class ActivityPackagesController {
  constructor(
    private readonly activityPackagesService: ActivityPackagesService
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'All activity packages',
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(ActivityPackage),
      },
    },
  })
  async findAll() {
    return this.activityPackagesService.findAll();
  }
}
