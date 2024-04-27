import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity({
  database: 'report',
  name: 'robot_run_detail',
})
export class RobotRunDetail {
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

  @PrimaryColumn({
    type: 'varchar',
    length: 256,
    name: 'uuid',
  })
  uuid: string;

  @Column({
    type: 'int',
    nullable: false,
    name: 'kw_id',
  })
  kwId: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    name: 'kw_name',
  })
  kwName: string;

  @Column({
    type: 'varchar',
    length: 1000,
    nullable: false,
    name: 'kw_args',
  })
  kwArgs: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    name: 'kw_status',
  })
  kwStatus: string;

  @Column({
    type: 'varchar',
    length: 1000,
    nullable: false,
    name: 'messages',
  })
  messages: string;

  @Column({
    type: 'datetime',
    nullable: true,
    name: 'start_time',
  })
  startTime: Date;

  @Column({
    type: 'datetime',
    nullable: true,
    name: 'end_time',
  })
  endTime: Date;
}
