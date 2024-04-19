import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import PubNub = require('pubnub');
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
  private pubnub: PubNub;
  private privateNotiChannelPrefix = 'notification.';

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private configService: ConfigService,
  ) {
    this.pubnub = new PubNub({
      subscribeKey: this.configService.get('PUBNUB_SUBSCRIBE_KEY'),
      publishKey: this.configService.get('PUBNUB_PUBLISH_KEY'),
      userId: this.configService.get('PUBNUB_USER_ID'),
    });
  }

  async getNotifications(userId: number, options: {
    limit: number;
    page: number;
  }) {
    const findOptions: FindManyOptions<Notification> = {
      where: { userId },
      take: options.limit,
      skip: (options.page - 1) * options.limit,
      order: { createdAt: 'DESC' },
    };

    return this.notificationRepository.find(findOptions);
  }

  async getUnreadNotificationsCount(userId: number) {
    return this.notificationRepository.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(id: number) {
    return this.notificationRepository.update(id, { isRead: true });
  }

  async createNotification(createNotificationDto: CreateNotificationDto) {
    const notification = await this.notificationRepository.save({
      ...createNotificationDto,
    });

    await this.publishNotification(createNotificationDto.userId, notification);

    return notification;
  }

  private async publishNotification(userId: number, notification: Notification) {
    this.pubnub.publish({
      channel: `${this.privateNotiChannelPrefix}${userId}`,
      message: notification,
    });
  }
}
