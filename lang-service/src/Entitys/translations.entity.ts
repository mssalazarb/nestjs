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
}
