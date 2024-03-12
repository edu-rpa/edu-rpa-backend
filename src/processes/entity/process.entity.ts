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

  // NOTE: can use VersionColumn. Update version manually for now.
  @Column({
    nullable: false,
    default: 0,
  })
  version: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({
    nullable: true,
  })
  sharedByUserId: number;

  @ManyToOne(() => User, (user) => user.id)
  sharedByUser: User;
}