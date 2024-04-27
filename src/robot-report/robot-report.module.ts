import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RobotRunDetail } from './entity/robot-run-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RobotRunDetail], 'report'),
  ],
})
export class RobotReportModule {}
