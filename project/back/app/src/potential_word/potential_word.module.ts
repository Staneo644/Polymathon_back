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

@Module({
  imports: [TypeOrmModule.forFeature([PotentialWord]), 
    TypeOrmModule.forFeature([Word]),
    TypeOrmModule.forFeature([Theme])],
  controllers: [PotentialWordController],
  providers: [PotentialWordService, WordService, ThemeService, JwtService],
})
export class PotentialWordModule {}
