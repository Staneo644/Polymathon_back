import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word, filePath, numberOfDayWord, numberOfWordTake } from './word.entity';
import { NotFoundException } from '@nestjs/common';
import { PotentialWord } from 'src/potential_word/potential_word.entity';
import { ThemeService } from 'src/theme/theme.service';
import * as fs from 'fs';
import * as cron from 'node-cron';
import * as csv from 'csv-parser';
import { word, word_id } from 'src/entity';
import { UserService } from 'src/user/user.service';
import * as readline from 'readline';
import { usedDayWordLength } from './word.entity';

@Injectable()
export class WordService {
  private dayWords: Word[] = [];
  private usedDayWords: Word[] = [];

  constructor(
    @InjectRepository(Word)
    private readonly wordRepository: Repository<Word>,
    private readonly themeService: ThemeService,
    private readonly userService: UserService,
  ) {
    cron.schedule('0 0 * * *', () => {
      this.changeDayWords();
    });
  }

  async changeDayWords() {
    try {
      this.usedDayWords = this.usedDayWords.concat(this.dayWords);
      if (this.usedDayWords.length > usedDayWordLength)
        this.usedDayWords.slice(this.dayWords.length);
      this.dayWords = [];
      for (let i = 0; i < numberOfDayWord; i++) {
        
        let word: Word;
        do {
          word = await this.getRandomWord();
          console.log(word);
        } while (this.usedDayWords.includes(word));
        this.dayWords.push(word);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async getDayWords(): Promise<word_id[]> {
    await this.getWords()
    if (this.dayWords.length === 0) {
      await this.changeDayWords();
    }
    console.log(this.dayWords + 'A')
    return this.dayWords.map((word) => this.convertWord(word));
  }

  async getRandomWordList(): Promise<word_id[]> {
    await this.getWords()
    const words = await this.wordRepository.find({ relations: ['theme', 'positive_note', 'negative_note'] });
    const randomWords = [];
    for (let i = 0; i < numberOfWordTake; i++) {
      let word: Word;
      do {
        word = words[Math.floor(Math.random() * words.length)];
      } while (randomWords.includes(word));
      randomWords.push(word);
    }
    return randomWords.map((word) => this.convertWord(word));

  }

  async getRandomWord(): Promise<Word> {
    const itemCount = await this.wordRepository.count();
    if (itemCount == 0) throw new NotFoundException('No random word found.');
    const id = Math.floor(Math.random() * itemCount) + 1;
    const randomWord = await this.wordRepository.findOne({where: { id }, relations: ['theme', 'positive_note', 'negative_note']});
    return randomWord;
  }

  async note_word(note: boolean, id: number, username:string): Promise<Word> {
    const user = await this.userService.getUserByEmail(username);
    const word = await this.wordRepository.findOne({ where: { id } });
    if (note) {
      word.positive_note.push(user);
    } else {
      word.negative_note.push(user);
    }
    await this.wordRepository.update(id, word);
    return word;
  }

  async getWords(): Promise<void> {
    const number = await (this.wordRepository.count())
    if (number == 0) {
      await this.themeService.createDefaultTheme();
      this.importWordsFromCSV();
    }
  }

  async getWordById(id: number): Promise<Word> {
    await this.getWords()
    return this.wordRepository.findOne({ where: { id }, relations: ['theme', 'positive_note', 'negative_note'] });
  }

  convertWord(word: Word): word_id {
    return {
      name: word.name,
      definition: word.definition,
      etymology: word.etymology,
      example: word.example,
      gender: word.gender,
      id: word.id,
      theme: word.theme.title,
      positive_note: word.positive_note.length,
      negative_note: word.negative_note.length,
    };
  }

  async createWord(wordData: word, bringToCSV: boolean = true) {
    const theme = await this.themeService.getThemeByName(wordData.theme);
    console.log(wordData.name);

    if (!theme) {
      throw new NotFoundException('Theme not found.');
    }
    const value = this.wordRepository.create();
    value.name = wordData.name;
    value.theme = theme;
    value.definition = wordData.definition;
    value.etymology = wordData.etymology;
    value.example = wordData.example;
    value.gender = wordData.gender;
    const word = await this.getWordByName(wordData.name);
    if (word) {
      value.id = word.id;
      await this.wordRepository.update(word.id, value);
      this.changeWordInCSV([value]);
    } else {
      value.positive_note = [];
      value.negative_note = [];
      await this.wordRepository.save(value);
      if (bringToCSV)
        this.exportWordsToCSV([value]);
    }
  }

  async changeWordInCSV(wordsToUpdate: Word[]): Promise<void> {
    if (!fs.existsSync(filePath))
      return;
    const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const writeStream = fs.createWriteStream(filePath + '.tmp', { encoding: 'utf8' });
  
    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity,
    });
  
    for await (const line of rl) {
      wordsToUpdate.forEach((updatedWord) => {
        const [name, definition, etymology, example, gender, themeTitle] = line.split('\t');
        if (name === updatedWord.name) {
          const updatedLine = `${updatedWord.name}\t${updatedWord.definition}\t${updatedWord.etymology}\t${updatedWord.example}\t${updatedWord.gender}\t${updatedWord.theme.title}`;
          writeStream.write(updatedLine + '\n');
        } else {
          writeStream.write(line + '\n');
        }
      });
    }
    readStream.close();
    writeStream.close();
    await fs.promises.rename(filePath + '.tmp', filePath);
  }

  async exportWordsToCSV(words: Word[]): Promise<void> {
    const csvData = words.map((word) => {
      return `\n${word.name}\t${word.definition}\t${word.etymology}\t${word.example}\t${word.gender}\t${word.theme.title}`;
    });
    const csvContent = csvData.join('\n');
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, 'name\tdefinition\tetymology\texample\tgender\ttheme', 'utf8');
      console.log('Fichier CSV créé avec succès : ', filePath);
    } 
    fs.appendFileSync(filePath, csvContent, 'utf8');
  }

  async importWordsFromCSV() {
    if (fs.existsSync(filePath)) {
      const words: word[] = [];
    fs.createReadStream(filePath)
      .pipe(csv({ separator: '\t' }))
      .on('data', (row) => {
        console.log(row);
        words.push(row);
      })
      .on('end', () => {
        console.log('Mots récupérés avec succès:');
        console.log(words);
        for (const word of words) {
          this.createWord(word, false);
          console.log(word.name);
        }
      });
    }
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

  async seeWord(id: number, username: string): Promise<Word> {
    const user = await this.userService.getUserByEmail(username);
    const word = await this.wordRepository.findOne({ where: { id } });
    if (word)
      user.word_seeing.push(id);
      await this.userService.updateUser(id, user);
    return word;
  }

  async getWordByName(name: string): Promise<Word> {
    await this.getWords()
    return this.wordRepository.findOne({
      where: { name: name },
      relations: ['theme', 'positive_note', 'negative_note'],
    });
  }

  async getAllWords(): Promise<Word[]> {
    return this.wordRepository.find();
  }
}
