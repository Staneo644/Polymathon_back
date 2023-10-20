import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async changePassword(id: number, newPassword: string): Promise<void> {
    await this.userRepository.update(id, { password: newPassword });
  }

  async changeEmail(id: number, newEmail: string): Promise<void> {
    await this.userRepository.update(id, { email: newEmail });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async isUser(id: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id } });
    return !!user;
  }
}
