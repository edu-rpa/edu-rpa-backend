import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/users/entity/user.entity';

export enum DocumentTemplateType {
  IMAGE = 'image',
}

@Entity()
export class DocumentTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: DocumentTemplateType,
  })
  type: DocumentTemplateType;

  @Column({
    nullable: false,
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}