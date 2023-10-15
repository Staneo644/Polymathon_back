import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';




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

  //@ManyToOne(() => Theme, (theme) => theme.words)
  theme: string[];

  @Column({ default: 0 })
  positive_note: number;

  @Column({ default: 0 })
  negative_note: number;
}