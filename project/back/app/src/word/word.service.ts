import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word, filePath } from './word.entity';
import { NotFoundException } from '@nestjs/common';
import { PotentialWord } from 'src/potential_word/potential_word.entity';
import { ThemeService } from 'src/theme/theme.service';
import * as fs from 'fs';
import * as cron from 'node-cron'
import * as csv from 'csv-parser';
import { word } from 'src/entity';

@Injectable()
export class WordService {
  private dayWords: Word[] = [];
  private usedDayWords: Word[] = [];

  constructor(
    @InjectRepository(Word)
    private readonly wordRepository: Repository<Word>,
    private readonly themeService: ThemeService,
  ) {
    cron.schedule('0 0 * * *', () => {
      this.changeDayWords();
    });
  }

  async changeDayWords() {
    try {

      this.usedDayWords = this.usedDayWords.concat(this.dayWords);
      if (this.usedDayWords.length > 99)
      this.usedDayWords.slice(this.dayWords.length);
    this.dayWords = [];
    for (let i = 0; i < 3; i++) {
      let word: Word;
      do {
        word = await this.getRandomWord();
      }
      while (!this.usedDayWords.includes(word))
      this.dayWords.push(word);
  }
  }
  catch (e) {
    console.log(e);
  }
}


  async getDayWords(): Promise<Word[]> {
  if (this.dayWords.length === 0) {
    await this.changeDayWords();
  }
    return this.dayWords;
  }
  
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
  
  async createWord(wordData: PotentialWord) {
    const theme = await this.themeService.getThemeByName(wordData.theme);
    if (!theme) {
      throw new NotFoundException('Theme not found.');
    }
    const value = new Word();
    value.name = wordData.name;
    value.theme = theme;
    value.positive_note = 0;
    value.negative_note = 0;
    value.definition = wordData.definition;
    value.etymology = wordData.etymology;
    value.gender = wordData.gender;
    const word = await this.getWordByName(wordData.name);
    if (word) {
      value.id = word.id;
      value.negative_note = word.negative_note;
      value.positive_note = word.positive_note;
      await this.wordRepository.update(word.id, value);
    }
    else {
      this.wordRepository.save(value);
    }
  }

  async exportWordsToCSV(words:Word[]) : Promise<void>{
    const csvData = words.map((word) => {
      return `${word.name}\t${word.gender}\t${word.definition}\t${word.etymology}\t${word.theme.title}`;
    });
    const csvContent = csvData.join('\n');
    if (fs.existsSync(filePath)) {
      fs.appendFileSync(filePath, csvContent, 'utf8');
    } else {
      fs.writeFileSync(filePath, csvContent, 'utf8');
      console.log('Fichier CSV créé avec succès : ', filePath);
    }
  }

  async importWordsFromCSV() {
  const words:PotentialWord[] = [];
    fs.createReadStream(filePath)
  .pipe(csv({ separator: ' | ' }))
  .on('data', (row) => {
    words.push({
      name: row[0],
      definition: row[1],
      etymology: row[2],
      example: row[3],
      gender: row[4],
      theme: row[5],
      user: null,
      id: 0,
    });
  })
  .on('end', () => {
    console.log('Mots récupérés avec succès:');
    for (const word of words) {
      this.createWord(word);
    }
  });

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
