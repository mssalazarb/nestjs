import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Translations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  group: string;

  @Column()
  lang: string;

  @Column({ name: 'key_word' })
  keyWord: string;

  @Column()
  value: string;

  @Column({ name: 'created_at', default: 'now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
