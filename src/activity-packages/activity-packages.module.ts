import { Module } from '@nestjs/common';
import { ActivityPackagesService } from './activity-packages.service';

@Module({
  providers: [ActivityPackagesService]
})
export class ActivityPackagesModule {}
