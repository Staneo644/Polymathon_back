//import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Theme } from 'src/theme/theme.entity';

const {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} = require('typeorm');

@Entity()
export class Word {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  definition: string;

  @Column()
  gender: string;

  @Column()
  etymology: string;

  @ManyToOne(() => Theme, (theme) => theme.words)
  theme: Theme;

  @Column({ default: 0 })
  positive_note: number;

  @Column({ default: 0 })
  negative_note: number;
}
