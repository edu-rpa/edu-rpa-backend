import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityPackage } from 'src/schemas/activity-package.schema';

@Injectable()
export class ActivityPackagesService {
  constructor(
    @InjectModel(ActivityPackage.name) private packageModel: Model<ActivityPackage>
  ) {}

  async findAll() {
    return this.packageModel.find().exec();
  }
}
