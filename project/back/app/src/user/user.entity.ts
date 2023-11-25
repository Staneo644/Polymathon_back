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

  @Column({ default: false })
  news_letter: boolean;

  @Column('jsonb')
  word_seeing: number[];

  @ManyToMany(() => Word, (word) => word.positive_note)
  positive_note: Word[];

  @ManyToMany(() => Word, (word) => word.negative_note)
  negative_note: Word[];

  hasPositiveWord (word:string):boolean {
    return this.positive_note.some((wordEntity) => wordEntity.name === word);
  }

  hasNegativeWord (word:string):boolean {
    return this.negative_note.some((wordEntity) => wordEntity.name === word);
  }
}
