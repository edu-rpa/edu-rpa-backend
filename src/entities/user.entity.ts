import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    nullable: true,
  })
  avatarUrl: string;

  @Column({
    nullable: true,
  })
  hashedPassword: string;

  @Column({
    default: 'local',
  })
  provider: string;

  @Column({
    nullable: true,
  })
  providerId: string;
}