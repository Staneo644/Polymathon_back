import { Injectable } from '@nestjs/common';
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
    private configService: ConfigService
   
  ) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    console.log(`JWT_SECRET: ${jwtSecret}`);
    jwtConstants.secret = jwtSecret;
    
  }

  async createUser(user: User) {
    const isUser = await this.getUserByEmail(user.email);
    if (isUser)
      return null;
    user.password = await bcrypt.hash(user.password, 10);
    console.log(user);
    await this.userRepository.save(user);
    return await (this.login(user));
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

  async login(user: User) {
    console.log(user)
    const RealUser = await this.getUserByEmail(user.email);
    console.log(RealUser);
    if (!RealUser) return null;
    if (bcrypt.compare(user.password, RealUser.password)) {
      let role = 'user';
      if (user.email === 'polymathon@proton.me' || user.email === 'aurele.josserand@gmail.com')
        role = 'admin';
      const payload = { sub: RealUser.id, username: RealUser.email, role: role };
      return {
        access_token: this.jwtService.sign(payload, { secret: jwtConstants.secret }),
      };
    }
  }
}
