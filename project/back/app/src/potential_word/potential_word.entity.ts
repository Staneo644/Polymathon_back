// potential-word.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { definition_wik } from 'src/entity';

@Entity()
export class PotentialWord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: -1 })
  true_word: number;

  @Column()
  theme: string;

  @Column()
  name: string;

  @Column()
  definition: string;

  @Column()
  etymology: string;

  @Column()
  example: string;

  @Column()
  gender: string;

  @Column('jsonb')
  wiki_def: definition_wik[];

  @ManyToOne(() => User, (user) => user.email)
  @JoinColumn({ name: 'userEmail' })
  user: User;
}
