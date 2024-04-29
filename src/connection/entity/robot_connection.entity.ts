import { table } from 'console';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Connection } from '.';
import { Robot } from 'src/robot/entity/robot.entity';

@Entity({
  database: 'core',
  name: 'robot_connection',
})
export class RobotConnection {
  @PrimaryColumn({
    nullable: false,
    name: 'robot_key',
  })
  robotKey: string;

  @PrimaryColumn({
    nullable: false,
    name: 'connection_key',
  })
  connectionKey: string;

  @Column({
    name: 'isActivate',
    nullable: false,
    default: true,
  })
  isActivate: boolean;

  // TODO: update the inverse side of this relationship
  @ManyToOne(() => Robot, undefined, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'robot_key', referencedColumnName: 'robotKey' })
  robot: Robot;

  @ManyToOne(() => Connection)
  @JoinColumn({ name: 'connection_key', referencedColumnName: 'connectionKey' })
  connection: Connection;
}
