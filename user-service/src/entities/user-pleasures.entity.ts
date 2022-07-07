import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Users } from './users.entity';
import { Pleasures } from './pleasures.entity';

@Entity()
export class UserPleasures {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users, (user) => user.id)
  userId: Users;

  @OneToOne(() => Pleasures, (pleasure) => pleasure.id)
  pleasureId: Pleasures;

  @Column({ name: 'created_at', default: 'now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
