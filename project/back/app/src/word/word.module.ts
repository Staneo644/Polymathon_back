import { Module } from '@nestjs/common';
import { WordController } from './word.controller';
import { WordService } from './word.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './word';

@Module({
  imports: [
    TypeOrmModule.forFeature([Word])
  ],
  controllers: [WordController],
  providers: [WordService]
})
export class WordModule {}