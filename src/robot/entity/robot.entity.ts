import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/entity/user.entity';
import { Process } from 'src/processes/entity/process.entity';

@Entity()
export class Robot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  name: string;

  // RobotFramework code (JSON format, stringified)  
  @Column({
    nullable: false,
    type: 'longtext'
  })
  code: string;

  @Column({
    nullable: false,
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({
    nullable: false,
  })
  processId: string;

  @ManyToOne(() => Process, (process) => process.id)
  process: Process;

  @Column({
    nullable: false,
  })
  processVersion: number;

  @CreateDateColumn()
  createdAt: Date;
}