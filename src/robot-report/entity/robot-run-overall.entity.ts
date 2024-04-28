import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({
  database: 'report',
  name: 'robot_run_overall',
})
export class RobotRunOverall {
  @PrimaryColumn({
    type: 'varchar',
    length: 256,
  })
  uuid: string;

  @Column({
    type: 'int',
    nullable: false,
    name: 'user_id',
  })
  userId: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'process_id',
  })
  processId: string;

  @Column({
    type: 'int',
    nullable: false,
    name: 'version',
  })
  version: number;

  @Column({
    type: 'int',
    nullable: false,
    name: 'failed',
  })
  failed: number;

  @Column({
    type: 'int',
    nullable: false,
    name: 'passed',
  })
  passed: number;

  @Column({
    type: 'nvarchar',
    length: 1000,
    nullable: true,
    name: 'error_message',
  })
  errorMessage: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'start_time',
  })
  startTime: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'end_time',
  })
  endTime: Date;

  @Column({
    type: 'int',
    nullable: true,
    name: 'elapsed_time',
  })
  elapsedTime: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_date',
  })
  createdDate: Date;
}
