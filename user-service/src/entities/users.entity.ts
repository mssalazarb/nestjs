import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { GenderTypes } from './gender-types.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  email: string;

  @Column()
  telephone: string;

  @Column()
  birthday: string;

  @OneToOne(() => GenderTypes, (gender) => gender.id)
  @JoinColumn({ name: 'gender_id' })
  genderId: GenderTypes;

  @Column()
  identification: string;

  @Column()
  avatar: string;

  @Column()
  password: string;

  @Column()
  verified: boolean;

  @Column({ name: 'created_at', default: 'now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
