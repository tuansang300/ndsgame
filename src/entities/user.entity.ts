import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoleUser } from './role.entity';
import { BaseEntity } from './base.entity';
import * as bcrypt from 'bcrypt';
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

  @Column()
  @OneToOne((id) => RoleUser, (role) => role.id)
  role: number;

  @Column()
  phone: string;

  @Column({ default: true })
  isActive: boolean;

  setPassword(password: string) {
    const saltrounds = 10;
    const hashedpasswprd = bcrypt.hashSync(password, saltrounds);
    this.password = hashedpasswprd;
  }

  getPassword() {
    return this.password;
  }

  checkPassword(password: string): boolean {
    console.log(this.password, password);
    return bcrypt.compareSync(password, this.password);
  }
}
