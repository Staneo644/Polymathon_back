import { Controller, Post, Put, Query } from '@nestjs/common';
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
import { note, word_id } from 'src/entity';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Controller('word')
export class WordController {
  constructor(private readonly wordService: WordService, private readonly userService: UserService) {}

  convert = (wordList:word_id[], user:User):word_id[] => {
    if (!user || !wordList) return wordList;

    wordList.forEach((word) => {
      if (user.hasPositiveWord(word.name)) {word.personnal_note = note.positif;
      }
       else {
         if (user.hasNegativeWord(word.name)) word.personnal_note = note.negatif;
          else word.personnal_note = note.neutre;
        }
        return word;});


    return wordList;
  }

  @Get('random')
  async getRandomWord(): Promise<word_id[]> {
    const word = await this.wordService.getRandomWordList();
    if (!word) {
      throw new NotFoundException('No random word found.');
    }
    return word;
  }

  @Get('random/token')
  @UseGuards(AuthGuard)
  async getRandomWordConnected(@Request() id: any): Promise<word_id[]> {
    const rep = await this.getRandomWord()
    if (rep) {
      return this.convert(rep, await this.userService.getUserByEmail(id.user.username));
  }}

  @UseGuards(AuthGuard)
  @Put(':id/:note')
  async note_word(@Request() id: any, @Param('note') note: number, @Param('id') wordId: number):Promise<number> {
    const word = await this.wordService.note_word(note ,wordId, id.user.username);
    // if (!word) {
    //   throw new NotFoundException('No random word found.');
    // }
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
  async getDayWords(): Promise<word_id[]> {
    try {
      return await this.wordService.getDayWords();
    } catch (e) {
      console.log(e);
    }
  }

  @Get('day/token')
  @UseGuards(AuthGuard)
  async getDayWordsConnected(@Request() id: any): Promise<word_id[]> {
    const rep = await this.getDayWords()
    if (rep) {
      return this.convert(rep, await this.userService.getUserByEmail(id.user.username));
  }}

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteWord(@Param('id') id: number) {
    const result = await this.wordService.deleteWord(id);
    if (!result) {
      throw new NotFoundException('Word not found.');
    }
    return { message: 'Word deleted successfully' };
  }

  @Get('name/:name')
  async getWordByName(@Param('name') name: string): Promise<word_id> {
    name = name.toLocaleLowerCase();
    const word = await this.wordService.getWordByName(name);
    if (!word) {
      throw new NotFoundException('Word not found.');
    }
    return this.wordService.convertWord(word);
  }

  @Get('popular')
  async getPopularWords(): Promise<word_id[]> {
    return await this.wordService.getPopularWords();
  }

  @Get('unpopular')
  async getUnpopularWords(): Promise<word_id[]> {
    return await this.wordService.getUnpopularWords();
  }


  @Get('string/:substring')
  async findWordsContainingSubstring(@Param('substring') substring: string): Promise<word_id[]> {
    return await this.wordService.findWordsContainingSubstring(substring);
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

  @Get('theme')
  async getWordsByThemes(@Query('themes') themes: string[]): Promise<word_id[]> {
    return this.wordService.getWordsByThemes(themes);
  }

  @Get('theme/token')
  @UseGuards(AuthGuard)
  async getWordsByThemesConnected(@Request() id: any, @Query('themes') themes: string[]): Promise<word_id[]> {
    return this.convert(await this.getWordsByThemes(themes), await this.userService.getUserByEmail(id.user.username));
  }
}
