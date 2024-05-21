import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createdDate: Date = new Date();

  @Column({ nullable: true })
  modifiedDate: Date;
}
