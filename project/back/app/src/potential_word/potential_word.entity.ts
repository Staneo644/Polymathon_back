// potential-word.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class PotentialWord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  theme: string;

  @Column()
  name: string;

  @Column()
  definition: string;

  @Column()
  gender: string;

  @Column()
  etymologie: string;

  @ManyToOne(() => User, (user) => user.email)
  @JoinColumn({ name: 'userEmail' })
  user: User;
}
