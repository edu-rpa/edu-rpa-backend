import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity({
  database: 'report',
  name: 'robot_run_log',
})
export class RobotRunLog {
  @PrimaryColumn({
    type: 'varchar',
    length: 50,
    name: 'instance_id',
  })
  instanceId: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'process_id_version',
  })
  processIdVersion: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    name: 'user_id',
  })
  userId: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    name: 'instance_state',
  })
  instanceState: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'launch_time',
  })
  launchTime: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_date',
  })
  createdDate: Date;
}
