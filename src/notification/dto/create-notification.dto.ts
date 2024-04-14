import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { NotificationType } from '../entity/notification.entity';

export class CreateNotificationDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;
}