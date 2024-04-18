import { Module } from '@nestjs/common';
import { ProcessesService } from './processes.service';
import { ProcessesController } from './processes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProcessDetail, 
  ProcessDetailSchema,
} from 'src/processes/schema/process.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
  Process,
} from 'src/processes/entity/process.entity';
import { ProcessesValidateService } from './processes-validate.service';
import { ConnectionModule } from 'src/connection/connection.module';
import { ActivityPackagesModule } from 'src/activity-packages/activity-packages.module';
import { UsersModule } from 'src/users/users.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Process]),
    MongooseModule.forFeature([{ name: ProcessDetail.name, schema: ProcessDetailSchema }]),
    ConnectionModule,
    ActivityPackagesModule,
    UsersModule,
    NotificationModule,
  ],
  providers: [ProcessesService, ProcessesValidateService],
  controllers: [ProcessesController]
})
export class ProcessesModule {}
