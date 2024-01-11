import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum AuthenticationProvider {
  GOOGLE = 'Google',
  LOCAL = 'Local',
}

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
    nullable: false,
    type: 'enum',
    enum: AuthenticationProvider,
    default: AuthenticationProvider.LOCAL,
  })
  provider: string;

  @Column({
    nullable: true,
  })
  providerId: string;
}