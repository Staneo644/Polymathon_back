import { Controller, Post, Put } from '@nestjs/common';
import { WordService } from './word.service';
import { Word } from './word.entity';
import {
  Get,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { word_id } from 'src/entity';

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

  @UseGuards(AuthGuard)
  @Put(':id')
  async note_word(@Request() id: any, @Body() note: boolean, @Param('id') wordId: number) {
    const word = await this.wordService.note_word(note,wordId, id.user.username);
    if (!word) {
      throw new NotFoundException('No random word found.');
    }
    return word;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateWord(@Param('id') id: number, @Body() wordData: Word) {
    const updatedWord = await this.wordService.updateWord(id, wordData);
    if (!updatedWord) {
      throw new NotFoundException('Word not found.');
    }
    return updatedWord;
  }

  @Get('day')
  async getDayWords(): Promise<Word[]> {
    try {
      return await this.wordService.getDayWords();
    } catch (e) {
      console.log(e);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteWord(@Param('id') id: number) {
    const result = await this.wordService.deleteWord(id);
    if (!result) {
      throw new NotFoundException('Word not found.');
    }
    return { message: 'Word deleted successfully' };
  }

  @Get(':name')
  async getWordByName(@Param('name') name: string): Promise<word_id> {
    const word = await this.wordService.getWordByName(name);
    if (!word) {
      throw new NotFoundException('Word not found.');
    }
    return this.wordService.convertWord(word);
  }

  @Get('id/:id')
  async getWordById(@Param('id') id: number): Promise<word_id> {
    const word = await this.wordService.getWordById(id);
    if (!word) {
      throw new NotFoundException('Word not found.');
    }
    return this.wordService.convertWord(word);
  }

  @Post(':id')
  @UseGuards(AuthGuard)
  async seeWord(@Request() id: any, @Param('id') id_word: number) {
    const newWord = await this.wordService.seeWord(id_word, id.user.username);
    return newWord;
  }
}
