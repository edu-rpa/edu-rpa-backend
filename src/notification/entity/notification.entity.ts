import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/entity/user.entity';

// TODO: send notification of ROBOT_EXECUTION
export enum NotificationType {
  ROBOT_TRIGGER = 'ROBOT_TRIGGER',
  ROBOT_EXECUTION = 'ROBOT_EXECUTION',
  PROCESS_SHARED = 'PROCESS_SHARED',
  CONNECTION_CHECK = 'CONNECTION_CHECK',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: true,
  })
  content: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({
    nullable: false,
    default: false,
  })
  isRead: boolean;

  @Column({
    nullable: false,
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}