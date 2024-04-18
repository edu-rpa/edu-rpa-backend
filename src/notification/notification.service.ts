import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entity/notification.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

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
    return this.notificationRepository.save({
      ...createNotificationDto,
    });
  }
}
