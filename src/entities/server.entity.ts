import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoleUser } from './role.entity';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Entity()
export class ServerOwn extends BaseEntity {
  @Column()
  @OneToOne((id) => User, (user) => user.id)
  OwnUser: number;

  @Column()
  ServerName: string;

  @Column()
  IPServer: string;

  @Column()
  UserDB: string;

  @Column()
  PasswordDB: string;

  @Column()
  TimeBegin: Date;

  @Column()
  TimeEnd: Date;

  @Column({ default: true })
  isActive: boolean;

  setPassword(password: string) {
    const saltrounds = 10;
    const hashedpasswprd = bcrypt.hashSync(password, saltrounds);
    this.PasswordDB = hashedpasswprd;
  }

  getPassword() {
    return this.PasswordDB;
  }
}
