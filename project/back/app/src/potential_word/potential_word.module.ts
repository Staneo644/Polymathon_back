import { Module } from '@nestjs/common';
import { PotentialWordController } from './potential_word.controller';
import { PotentialWordService } from './potential_word.service';
import { PotentialWord } from './potential_word.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordService } from 'src/word/word.service';
import { Word } from 'src/word/word.entity';
import { ThemeService } from 'src/theme/theme.service';
import { Theme } from 'src/theme/theme.entity';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([PotentialWord]),
    TypeOrmModule.forFeature([Word]),
    TypeOrmModule.forFeature([Theme]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [PotentialWordController],
  providers: [
    PotentialWordService,
    WordService,
    ThemeService,
    JwtService,
    UserService,
    ConfigService,
  ],
})
export class PotentialWordModule {}
