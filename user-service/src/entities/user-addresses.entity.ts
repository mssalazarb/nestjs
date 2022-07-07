import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class UserAddresses {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users, (user) => user.id)
  userId: Users;

  @Column({ name: 'main_street' })
  mainStreet: string;

  @Column({ name: 'side_street' })
  sideStreet: string;

  @Column()
  num: string;

  @Column()
  reference: string;

  @Column()
  lat: number;

  @Column()
  lng: number;

  @Column()
  default: boolean;

  @Column({ name: 'created_at', default: 'now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
