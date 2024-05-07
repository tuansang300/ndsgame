import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoleUser } from './role.entity';
import { BaseEntity } from './base.entity';
import { Features } from './feature.entity';
import { ServerOwn } from './server.entity';

@Entity()
export class ListFeatureServer extends BaseEntity {
  @OneToOne((id) => Features, (feature) => feature.id)
  idFeature: number;

  @OneToOne((id) => ServerOwn, (sv) => sv.id)
  idServer: number;

  @Column({ default: false })
  isDelete: boolean;
}
