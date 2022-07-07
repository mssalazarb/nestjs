import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class UserCards {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users, (user) => user.id)
  userId: Users;

  @Column({ name: 'card_number' })
  cardNumber: string;

  @Column()
  expiration: string;

  @Column()
  cvv: number;

  @Column()
  type: string;

  @Column({ name: 'created_at', default: 'now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
