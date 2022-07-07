import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GenderTypes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;
}
