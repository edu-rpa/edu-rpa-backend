import { Module } from '@nestjs/common';
import { ProcessesService } from './processes.service';
import { ProcessesController } from './processes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Process as ProcessDocument, 
  ProcessSchema 
} from 'src/processes/schema/process.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
  Process as ProcessEntity,
} from 'src/processes/entity/process.entity';
import { ProcessesValidateService } from './processes-validate.service';
import { ConnectionModule } from 'src/connection/connection.module';
import { ActivityPackagesModule } from 'src/activity-packages/activity-packages.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProcessEntity]),
    MongooseModule.forFeature([{ name: ProcessDocument.name, schema: ProcessSchema }]),
    ConnectionModule,
    ActivityPackagesModule,
  ],
  providers: [ProcessesService, ProcessesValidateService],
  controllers: [ProcessesController]
})
export class ProcessesModule {}
