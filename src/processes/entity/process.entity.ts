import { Entity, Column, ManyToOne, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entity/user.entity';

@Entity()
export class Process {
  @PrimaryColumn()
  id: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: true,
  })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    nullable: false,
    default: 0,
  })
  version: number;

  @Column({
    nullable: false,
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}