import { Entity, Column, ManyToOne, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/entity/user.entity';
import { Process } from 'src/processes/entity/process.entity';

export enum TriggerType {
  SCHEDULE = 'schedule',
  MANUAL = 'manual',
  EVENT_GMAIL = 'event-gmail',
  EVENT_DRIVE = 'event-drive',
  EVENT_FORMS = 'event-forms',
}

@Entity()
export class Robot {
  @Column({
    nullable: false,
  })
  name: string;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @PrimaryColumn()
  processId: string;

  @ManyToOne(() => Process, (process) => process.id)
  process: Process;

  @PrimaryColumn()
  processVersion: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: TriggerType,
    default: TriggerType.MANUAL,
  })
  triggerType: TriggerType;
}