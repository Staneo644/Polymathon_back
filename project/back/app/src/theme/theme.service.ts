import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Theme } from './theme.entity';
import { Repository } from 'typeorm';
import { Word } from 'src/word/word.entity';
import { NotFoundException } from '@nestjs/common';
import { random_word } from 'src/constant';
import { theme, theme_id } from 'src/entity';

@Injectable()
export class ThemeService {
  constructor(
    @InjectRepository(Theme)
    private themeRepository: Repository<Theme>,
  ) {}

  async getThemes(): Promise<theme_id[]> {
    // let themes: Theme[] = [];
    const themes = await this.themeRepository.find({relations: ['parentTheme']});
    if (themes.length === 0)
    await this.createDefaultTheme();
    const ret = themes.map(theme => ({
       name: theme.title,
       parent: theme.parentTheme?.title,
       words_number: theme.words?.length??0, 
    }))
    return ret;
  }

  async createDefaultTheme() {
    await this.addTheme({ name: 'Art', parent: '' });
    await this.addTheme({ name: 'Science', parent: '' });
    await this.addTheme({ name: 'Profession', parent: '' });
    await this.addTheme({ name: 'Religion', parent: '' });
    await this.addTheme({ name: 'Territoire', parent: '' });
    await this.addTheme({ name: 'Expression', parent: '' });

    this.addTheme({ name: 'Musique', parent: (await this.getThemeByName('Art')).title });
    this.addTheme({ name: 'Peinture', parent: (await this.getThemeByName('Art')).title });
    this.addTheme({ name: 'Architecture', parent: (await this.getThemeByName('Art')).title });
    this.addTheme({ name: 'Littérature', parent: (await this.getThemeByName('Art')).title });
    this.addTheme({ name: 'Gastronomie', parent: (await this.getThemeByName('Art')).title });
    this.addTheme({ name: 'Œnologie', parent: (await this.getThemeByName('Art')).title });


    this.addTheme({ name: 'Médecine', parent: (await this.getThemeByName('Science')).title });
    this.addTheme({ name: 'Astronomie', parent: (await this.getThemeByName('Science')).title });
    this.addTheme({ name: 'Géologie', parent: (await this.getThemeByName('Science')).title });
    this.addTheme({ name: 'Botanique', parent: (await this.getThemeByName('Science')).title });
    this.addTheme({ name: 'Zoologie', parent: (await this.getThemeByName('Science')).title });


    this.addTheme({ name: 'Agriculture', parent: (await this.getThemeByName('Profession')).title });
    this.addTheme({ name: 'Marine', parent: (await this.getThemeByName('Profession')).title });
    this.addTheme({ name: 'Armée', parent: (await this.getThemeByName('Profession')).title });
    this.addTheme({ name: 'Administration', parent: (await this.getThemeByName('Profession')).title });
    this.addTheme({ name: 'Équitation', parent: (await this.getThemeByName('Profession')).title });


    this.addTheme({ name: 'Christianisme', parent: (await this.getThemeByName('Religion')).title });
    this.addTheme({ name: 'Islam', parent: (await this.getThemeByName('Religion')).title });
    this.addTheme({ name: 'Judaïsme', parent: (await this.getThemeByName('Religion')).title });


    this.addTheme({ name: 'Orient', parent: (await this.getThemeByName('Territoire')).title });
    this.addTheme({ name: 'Grèce', parent: (await this.getThemeByName('Territoire')).title });
    this.addTheme({ name: 'Rome', parent: (await this.getThemeByName('Territoire')).title });
  }

  async getThemeByName(title: string): Promise<Theme> {
    return await this.themeRepository.findOne({ where: { title } });
  }

  async addTheme(themeData: theme): Promise<Theme> {
    const test = await this.getThemeByName(themeData.name);
    if (test) {
      console.log('Theme already exists');
      return;
    }
    let parentTheme = null
    if (themeData.parent != '')
      parentTheme = await this.getThemeByName(themeData.parent??'');
    const newTheme = this.themeRepository.create({title: themeData.name, parentTheme: parentTheme, childrenThemes: [], words: []});
    return this.themeRepository.save(newTheme);
  }

  async deleteTheme(themeId: number): Promise<void> {
    const theme = await this.getThemeById(themeId);
    if (theme.childrenThemes.length > 0) {
      console.log("Can't delete theme with children themes");
      return;
    }
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
    return this.themeRepository.findOne( {relations: ['parentTheme'],  where: { id } });
  }
}
