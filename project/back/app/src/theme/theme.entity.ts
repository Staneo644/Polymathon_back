import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Word } from 'src/word/word.entity';

@Entity()
export class Theme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: true })
  can_have_words: boolean;

  @OneToMany(() => Word, (word) => word.theme)
  words: Word[];

  @ManyToOne(() => Theme, (theme) => theme.childrenThemes)
  parentTheme: Theme | null;

  @OneToMany(() => Theme, (theme) => theme.parentTheme)
  childrenThemes: Theme[];
}
