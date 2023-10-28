import { Module } from '@nestjs/common';
import { ActivityPackagesService } from './activity-packages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityPackage, ActivityPackageSchema } from 'src/schemas/activity-package.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ActivityPackage.name, schema: ActivityPackageSchema }])
  ],
  providers: [ActivityPackagesService]
})
export class ActivityPackagesModule {}
