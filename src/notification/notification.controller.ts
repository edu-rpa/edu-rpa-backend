import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { UserDecor } from 'src/common/decorators/user.decorator';
import { UserPayload } from 'src/auth/strategy/jwt.strategy';
import { OverrideGuard } from 'src/common/decorators/override-guard.decorator';
import { ApiKeyGuard } from 'src/auth/guard/api-key.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notification')
@ApiTags('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Get()
  @ApiQuery({ name: 'limit' })
  @ApiQuery({ name: 'page' })
  @ApiBearerAuth()
  async getNotifications(
    @UserDecor() user: UserPayload,
    @Query('limit') limit: number,
    @Query('page') page: number
  ) {
    return this.notificationService.getNotifications(user.id, { page, limit });
  }

  @Get('/count/unread')
  @ApiBearerAuth()
  async getUnreadNotificationsCount(@UserDecor() user: UserPayload) {
    return this.notificationService.getUnreadNotificationsCount(user.id);
  }

  @Put('/mark-as-read')
  @ApiBearerAuth()
  async markAsRead(@UserDecor() user: UserPayload, @Body('id') id: number) {
    return this.notificationService.markAsRead(id);
  }

  @OverrideGuard(ApiKeyGuard)
  @Post()
  @ApiSecurity('Service-Key')
  async createNotification(
    @Body() createNotificationDto: CreateNotificationDto
  ) {
    return this.notificationService.createNotification(createNotificationDto);
  }
}
