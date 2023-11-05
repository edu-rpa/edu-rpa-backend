import { Module } from '@nestjs/common';
import { ActivityPackagesService } from './activity-packages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityPackage, ActivityPackageSchema } from 'src/schemas/activity-package.schema';
import { ActivityPackagesController } from './activity-packages.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ActivityPackage.name, schema: ActivityPackageSchema }])
  ],
  providers: [ActivityPackagesService],
  exports: [ActivityPackagesService],
  controllers: [ActivityPackagesController]
})
export class ActivityPackagesModule {}
