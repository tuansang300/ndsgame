import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class RoleUser extends BaseEntity {
  @Column()
  permission: number;

  @Column()
  FullName: string;

  @Column()
  ShortName: string;
}
