import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoleUser } from './role.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Features extends BaseEntity {
  @Column()
  Fullname: string;

  @Column()
  ShortName: string;

  @Column()
  Price: number;

  @Column()
  urlDescription: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  Discount: number;
}
