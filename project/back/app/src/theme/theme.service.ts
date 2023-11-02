import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Theme } from './theme.entity';
import { Repository } from 'typeorm';
import { Word } from 'src/word/word.entity';
import { NotFoundException } from '@nestjs/common';
import { random_word } from 'src/constant';
import { theme_id } from 'src/entity';

@Injectable()
export class ThemeService {
  constructor(
    @InjectRepository(Theme)
    private themeRepository: Repository<Theme>,
  ) {}

  async getThemes(): Promise<theme_id[]> {
    let themes: theme_id[] = [];
    themes = await this.themeRepository.query('SELECT * FROM theme');
    return themes;
  }

  async getThemeByName(title: string): Promise<Theme> {
    return this.themeRepository.findOne({ where: { title } });
  }

  async addTheme(themeData: Partial<Theme>): Promise<Theme> {
    const newTheme = this.themeRepository.create(themeData);
    return this.themeRepository.save(newTheme);
  }

  async deleteTheme(themeId: number): Promise<void> {
    await this.themeRepository.delete(themeId);
  }

  async getRandomWordByTheme(themeId: number): Promise<Word> {
    const theme = await this.themeRepository.findOne({
      where: { id: themeId },
    });
    const itemCount = await this.themeRepository.count();
    if (itemCount == 0) throw new NotFoundException('No random word found.');
    const randomIndex = Math.floor(Math.random() * itemCount);
    const randomWord = await this.themeRepository.query(
      `SELECT * FROM items OFFSET ${randomIndex} LIMIT 1`,
    );
    return randomWord;
  }

  async getRandomWordsByTheme(themeId: number): Promise<Word[]> {
    const words = [];
    let find_word = false;
    for (let i = 0; i < random_word; i++) {
      const word = await this.getRandomWordByTheme(themeId);
      for (let j = 0; j < words.length; j++) {
        if (word.id == words[j].id) {
          i--;
          find_word = true;
          break;
        }
      }
      if (find_word == false) {
        words.push(word);
      }
      find_word = false;
    }
    return words;
  }

  async getThemeById(id: number): Promise<Theme> {
    return this.themeRepository.findOne({ where: { id } });
  }
}
