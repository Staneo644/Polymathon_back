import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt.constant';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    console.log(`JWT_SECRET: ${jwtSecret}`);
    jwtConstants.secret = jwtSecret;
  }

  async createUser(user: User) {
    const isUser = await this.getUserByEmail(user.email);
    if (isUser) return null;
    user.password = await bcrypt.hash(user.password, 10);
    user.positive_note = [];
    user.negative_note = [];
    user.word_seeing = [];
    console.log(user);
    await this.userRepository.save(user);
    return await this.login(user);
  }

  async newsletter(user:string): Promise<void> {
    const isUser = await this.getUserByEmail(user);
    if (!isUser) return null;
    isUser.news_letter = !isUser.news_letter;
    await this.userRepository.save(isUser);
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
    return await this.userRepository.findOne({ where: { email }, relations: ['positive_note', 'negative_note'] });
  }

  async isUser(id: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id } });
    return !!user;
  }

  async login(user: User) {
    const RealUser = await this.getUserByEmail(user.email);
    if (!RealUser) return null;
    if (bcrypt.compare(user.password, RealUser.password)) {
      let role = 'user';
      if (
        user.email === 'polymathon@proton.me' ||
        user.email === 'aurele.josserand@gmail.com'
      )
        role = 'admin';
      const payload = {
        sub: RealUser.id,
        username: RealUser.email,
        role: role,
      };
      return {
        access_token: this.jwtService.sign(payload, {
          secret: jwtConstants.secret,
        }),
      };
    }
  }

  async updateUser(id: number, userData: User){
    // const updatedUser = await this.userRepository.update(id, userData);
    // if (!updatedUser) {
    //   throw new NotFoundException('User not found.');
    // }
    this.userRepository.save(userData);
  }
}
