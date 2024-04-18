import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectionService } from 'src/connection/connection.service';
import { RobotConnection } from 'src/connection/entity';
import { NotificationType } from 'src/notification/entity/notification.entity';
import { NotificationService } from 'src/notification/notification.service';
import { Repository } from 'typeorm';

@Injectable()
export class TaskScheduleService {
  private readonly logger = new Logger(TaskScheduleService.name);

  constructor(
    @InjectRepository(RobotConnection)
    private robotConnectionRepository: Repository<RobotConnection>,
    private notificationService: NotificationService,
    private connectionService: ConnectionService,
  ) {}

  // run at 12:00 AM every day
  @Cron('0 0 * * *')
  async checkRobotConnection() {
    this.logger.log('Checking robot connection');
    const checked = new Set<string>();
    const robotConnections = await this.robotConnectionRepository.find({
      relations: ['robot', 'connection'],
    });

    for (const robotConnection of robotConnections) {
      const connection = robotConnection.connection;

      if (!connection) {
        this.logger.error(`Connection not found for robot ${robotConnection.robotKey}`);
        continue;
      }

      if (checked.has(connection.connectionKey)) {
        continue;
      }

      try {
        await this.connectionService.refreshToken(
          connection.userId,
          connection.provider,
          connection.name,
        );
        this.logger.log(`Connection ${robotConnection.connectionKey} worked!`);
      } catch (error) {
        this.logger.error(`Connection ${robotConnection.connectionKey} failed!`);
        this.notificationService.createNotification({
          userId: robotConnection.robot.userId,
          type: NotificationType.CONNECTION_CHECK,
          title: 'Connection for robot failed',
          content: `Connection ${connection.name} of ${connection.provider} failed to connect. This may affect the robot ${robotConnection.robot.name}.`,
        });
      } finally {
        checked.add(connection.connectionKey);
      }
    }
  }

}
