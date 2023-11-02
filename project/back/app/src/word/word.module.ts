import { Module } from '@nestjs/common';
import { WordController } from './word.controller';
import { WordService } from './word.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './word.entity';
import { ThemeService } from 'src/theme/theme.service';
import { Theme } from 'src/theme/theme.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Word]), TypeOrmModule.forFeature([Theme])],
  controllers: [WordController],
  providers: [WordService, ThemeService, JwtService],
})
export class WordModule {}
