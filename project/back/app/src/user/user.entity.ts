import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ManyToMany, JoinTable } from 'typeorm';
import { Word } from 'src/word/word.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column('jsonb')
  word_seeing: number[];

  @ManyToMany(() => Word, (word) => word.positive_note)
  positive_note: Word[];

  @ManyToMany(() => Word, (word) => word.negative_note)
  negative_note: Word[];
}
