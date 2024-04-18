import { Module } from '@nestjs/common';
import { TaskScheduleService } from './task-schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RobotConnection } from 'src/connection/entity';
import { NotificationModule } from 'src/notification/notification.module';
import { ConnectionModule } from 'src/connection/connection.module';

@Module({
  providers: [TaskScheduleService],
  imports: [
    TypeOrmModule.forFeature([RobotConnection]),
    NotificationModule,
    ConnectionModule,
  ],
})
export class TaskScheduleModule {}
