import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  imports: [TypeOrmModule.forFeature([Notification])],
  exports: [NotificationService],
})
export class NotificationModule {}
