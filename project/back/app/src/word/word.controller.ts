import { Controller, Put } from '@nestjs/common';
import { WordService } from './word.service';
import { Word } from './word.entity';
import {
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';

@Controller('word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Get('random')
  async getRandomWord() {
    const word = await this.wordService.getRandomWord();
    if (!word) {
      throw new NotFoundException('No random word found.');
    }
    return word;
  }

  //@UseGuards(JwtIsAuthGuard)
  @Put(':id')
  async note_word(@Body() note: boolean, @Param('id') id: number) {
    const word = await this.wordService.note_word(note, id);
    if (!word) {
      throw new NotFoundException('No random word found.');
    }
    return word;
  }

  @Patch(':id')
  async updateWord(@Param('id') id: number, @Body() wordData: Word) {
    const updatedWord = await this.wordService.updateWord(id, wordData);
    if (!updatedWord) {
      throw new NotFoundException('Word not found.');
    }
    return updatedWord;
  }

  @Delete(':id')
  async deleteWord(@Param('id') id: number) {
    const result = await this.wordService.deleteWord(id);
    if (!result) {
      throw new NotFoundException('Word not found.');
    }
    return { message: 'Word deleted successfully' };
  }

  @Get('word')
  async getWordByName(@Body() name: string) {
    const word = await this.wordService.getWordByName(name);
    if (!word) {
      throw new NotFoundException('Word not found.');
    }
    return word;
  }

  @Get()
  async getAllWords() {
    const words = await this.wordService.getAllWords();
    return words;
  }
}
