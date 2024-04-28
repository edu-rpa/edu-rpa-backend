import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RobotRunDetail } from './entity/robot-run-detail.entity'; // Ensure the correct import path
import { RobotRunLog } from './entity/robot-run-log.entity';
import { RobotRunOverall } from './entity/robot-run-overall.entity';
import { RobotReportService } from './robot-report.service';
import { RobotReportController } from './robot-report.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RobotRunDetail, RobotRunLog, RobotRunOverall])],
  providers: [RobotReportService],
  controllers: [RobotReportController],
})
export class RobotReportModule {}
