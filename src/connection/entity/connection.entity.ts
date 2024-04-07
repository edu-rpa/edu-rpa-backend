import { Entity, Column, ManyToOne, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entity/user.entity';

export enum AuthorizationProvider {
  G_DRIVE = 'Google Drive',
  G_SHEETS = 'Google Sheets',
  G_GMAIL = 'Gmail',
  G_DOCS = 'Google Docs',
  G_CLASSROOM = 'Google Classroom',
  G_FORMS = 'Google Forms',
}

@Entity()
export class Connection {
  @PrimaryColumn({
    nullable: false,
    type: 'enum',
    enum: AuthorizationProvider,
  })
  provider: AuthorizationProvider;

  @PrimaryColumn({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  accessToken: string;

  @Column({
    nullable: false,
  })
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @PrimaryColumn({
    nullable: false,
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({
    nullable: false,
    name: "connection_key"
  })
  connectionKey: string;
}
