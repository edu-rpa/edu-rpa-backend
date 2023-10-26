import { Module } from '@nestjs/common';
import { ProcessesService } from './processes.service';
import { ProcessesController } from './processes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Process as ProcessDocument, 
  ProcessSchema 
} from 'src/schemas/process.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
  Process as ProcessEntity,
} from 'src/entities/process.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProcessEntity]),
    MongooseModule.forFeature([{ name: ProcessDocument.name, schema: ProcessSchema }]),
  ],
  providers: [ProcessesService],
  controllers: [ProcessesController]
})
export class ProcessesModule {}
