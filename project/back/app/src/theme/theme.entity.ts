const { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } = require('typeorm');// import { Word } from 'src/word/word';

@Entity()
export class Theme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  number_word: number;

  @Column({ nullable: true })
  parent: number;

//   @OneToMany(() => Word, (word) => word.theme)
//   words: Word[];

  @ManyToOne(() => Theme, (theme) => theme.subthemes)
  parentTheme: Theme;

  @OneToMany(() => Theme, (theme) => theme.parentTheme)
  subthemes: Theme[];
}