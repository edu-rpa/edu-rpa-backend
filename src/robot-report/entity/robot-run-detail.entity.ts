import { Entity, Column, ManyToOne, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/entity/user.entity';
import { Process } from 'src/processes/entity/process.entity';

@Entity({
  database: 'report',
  name: 'robot_run_detail'
})
export class RobotRunDetail {
  @Column({
    nullable: false,
    name: 'user_id'
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({
    nullable: false,
    name: 'process_id'
  })
  processId: string;

  @ManyToOne(() => Process, (process) => process.id)
  process: Process;

  @Column({
    nullable: false,
    name: 'kw_id'
  })
  kwId: string;
}