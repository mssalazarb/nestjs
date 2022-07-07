import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pleasures {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @Column()
  type: string;

  @Column({ name: 'created_at', default: 'now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
