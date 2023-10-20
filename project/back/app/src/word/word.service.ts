import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from './word.entity';
import { NotFoundException } from '@nestjs/common';
import { PotentialWord } from 'src/potential_word/potential_word.entity';
import { ThemeService } from 'src/theme/theme.service';

@Injectable()
export class WordService {
  constructor(
    @InjectRepository(Word)
    private readonly wordRepository: Repository<Word>,
    private readonly themeService: ThemeService,
  ) {}

  async getRandomWord(): Promise<Word> {
    const itemCount = await this.wordRepository.count();
    if (itemCount == 0) throw new NotFoundException('No random word found.');
    const randomIndex = Math.floor(Math.random() * itemCount);
    const randomWord = await this.wordRepository.query(
      `SELECT * FROM items OFFSET ${randomIndex} LIMIT 1`,
    );
    return randomWord;
  }

  async note_word(note: boolean, id: number): Promise<Word> {
    const word = await this.wordRepository.findOne({ where: { id } });
    if (note) {
      word.positive_note += 1;
    } else {
      word.negative_note += 1;
    }
    await this.wordRepository.update(id, word);
    return word;
  }

  async getWordById(id: number): Promise<Word> {
    return this.wordRepository.findOne({ where: { id } });
  }

  async createWord(wordData: PotentialWord): Promise<Word> {
    const theme = await this.themeService.getThemeById(wordData.themeId);
    let value = new Word();
    value.name = wordData.name;
    value.theme = theme;
    value.positive_note = 0;
    value.negative_note = 0;
    value.definition = wordData.definition;
    value.etymology = wordData.etymology;
    value.gender = wordData.gender;
    return this.wordRepository.save(value);
  }

  async updateWord(id: number, wordData: Word): Promise<Word> {
    await this.getWordById(id); // Vérifie si le mot existe
    await this.wordRepository.update(id, wordData);
    return this.getWordById(id);
  }

  async deleteWord(id: number): Promise<boolean> {
    try {
      if (this.getWordById(id) == null) {
        throw new NotFoundException('Word not found.');
      }

      const result = await this.wordRepository.delete(id);
      return result.affected > 0;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async getWordByName(name: string): Promise<Word> {
    return this.wordRepository.findOne({ where: { name: name } });
  }

  async getAllWords(): Promise<Word[]> {
    return this.wordRepository.find();
  }
}
