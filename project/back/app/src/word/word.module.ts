import { Module } from '@nestjs/common';
import { WordController } from './word.controller';
import { WordService } from './word.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './word.entity';
import { ThemeService } from 'src/theme/theme.service';
import { Theme } from 'src/theme/theme.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Word]),
    TypeOrmModule.forFeature([Theme]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [WordController],
  providers: [WordService, ThemeService, JwtService, UserService, ConfigService],
})
export class WordModule {}
