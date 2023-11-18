//import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Theme } from 'src/theme/theme.entity';
import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinColumn, JoinTable } from 'typeorm';

export const filePath = './words.csv';

export const usedDayWordLength = 20;
export const numberOfDayWord = 3;
export const numberOfWordTake = 10;

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

  @Column()
  example: string;

  @ManyToOne(() => Theme, (theme) => theme.words)
  @JoinColumn({ name: 'theme' })
  theme: Theme;

  @ManyToMany(() => User, (User) => User.positive_note)
  @JoinTable()
  positive_note: User[];

  @ManyToMany(() => User, (User) => User.negative_note)
  @JoinTable()
  negative_note: User[];
}
