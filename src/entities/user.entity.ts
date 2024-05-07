import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoleUser } from './role.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @OneToOne((id) => RoleUser, (role) => role.id)
  role: string;

  @Column()
  phone: string;

  @Column({ default: true })
  isActive: boolean;
}
