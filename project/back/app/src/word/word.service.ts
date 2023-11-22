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
import { note, word, word_id } from 'src/entity';
import { UserService } from 'src/user/user.service';
import * as readline from 'readline';
import { usedDayWordLength } from './word.entity';
import { get } from 'http';

@Injectable()
export class WordService {
  private dayWords: number[] = [];
  private usedDayWords: number[] = [];
  private allWords: number[] = [];

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
    this.allWords = (await this.wordRepository.find({ relations: ['theme', 'positive_note', 'negative_note'] })).map((word) => word.id);
    try {
      this.usedDayWords = this.usedDayWords.concat(this.dayWords);
      if (this.usedDayWords.length > usedDayWordLength)
        this.usedDayWords.slice(this.dayWords.length);
      this.dayWords = [];
      for (let i = 0; i < numberOfDayWord; i++) {
        
        let word: number;
        do {
          word = await this.getRandomWord();
        } while (!word && this.usedDayWords.includes(word));
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
    return (await this.convertWordList(await this.getWordsByIds(this.dayWords)));
  }

  async convertWordList(wordList: Word[]): Promise<word_id[]> {
    const ret  = wordList.map(async (word) => {
      return (this.convertWord(word));
    });
    return Promise.all(ret);
  }

  async getWordsByIds(ids: number[]): Promise<Word[]> {
    const promises = ids.map(async (id) => {
      return await this.getWordById(id);
    });
  
    return Promise.all(promises);
  }

  async findWordsContainingSubstring(substring: string): Promise<word_id[]> {
    const words = await this.wordRepository
      .createQueryBuilder('word')
      .leftJoinAndSelect('word.theme', 'theme')
      .where('word.name LIKE :substring', { substring: `%${substring}%` })
      .getMany();
    return (words).map((word) => this.convertWord(word));
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

  async getRandomWord(): Promise<number> {
    const itemCount = this.allWords.length;
    if (itemCount == 0) throw new NotFoundException('No random word found.');
    const id = Math.floor(Math.random() * itemCount) + 1;
    const randomWord = this.allWords[id]
    return randomWord;
  }

  async note_word(myNote: number, id: number, username:string): Promise<number> {
    const user = await this.userService.getUserByEmail(username);
    let ret = note.neutre;
    const word = await this.wordRepository.findOne({ where: { id }, relations: ['positive_note', 'negative_note'] });
    if (!word) {
      throw new Error(`Word with id ${id} not found.`);
    }
    if (word.negative_note.some(negativeUser => negativeUser.id == user.id)) {
      word.negative_note = word.negative_note.filter((word_user) => word_user.id !== user.id);
    }
    else {
      if (myNote == note.negatif) {
        word.negative_note.push(user);
        ret = note.negatif;
      }
    }
    if (word.positive_note.some(positiveUser => positiveUser.id == user.id)) {
      word.positive_note = word.positive_note.filter((word_user) => word_user.id !== user.id);
    }
    else {
      if (myNote == note.positif) {
        word.positive_note.push(user);
        ret = note.positif;
        }
    }
    await this.wordRepository.save(word);
    return ret;
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
      theme: word.theme?.title??'',
      positive_note: word.positive_note?.length??-1,
      negative_note: word.negative_note?.length??-1,
      personnal_note: note.neutre,
    };
  }

  async getWordsByThemes(themeNames:string[]): Promise<word_id[]> {
    let words: Word[] = [];
    if (!themeNames || themeNames.length == 0)
      return;
    for (let i = 0; i < themeNames.length; i++) {
      console.log(themeNames[i]);
      const theme = await this.themeService.getThemeAndWordsByName(themeNames[i]);
      if (theme){
        words = words.concat(theme.words);
      }
    }
    return this.convertWordList(words);
  }

  async getLikedWords(username: string): Promise<word_id[]> {
    const user = await this.userService.getUserByEmail(username);
    return this.convertWordList(user.positive_note);
  }

  async getDislikedWords(username: string): Promise<word_id[]> {
    const user = await this.userService.getUserByEmail(username);
    return this.convertWordList(user.negative_note);
  }

  async getSeenWords(username: string): Promise<word_id[]> {
    const user = await this.userService.getUserByEmail(username);
    return this.convertWordList(await this.getWordsByIds(user.word_seeing));
  }

  async getPopularWords(): Promise<word_id[]> {
    const words = await this.wordRepository.find({ relations: ['theme', 'positive_note', 'negative_note'] });
    const words2 = words.filter((word) => word.positive_note.length - word.negative_note.length > 0);
    words2.sort((a, b) => {
      return (b.positive_note.length - b.negative_note.length) - (a.positive_note.length - a.negative_note.length);
    });
    return this.convertWordList(words2.slice(0, 100));
  }

  async getUnpopularWords(): Promise<word_id[]> {
    const words = await this.wordRepository.find({ relations: ['theme', 'positive_note', 'negative_note'] });
    const words2 = words.filter((word) => word.negative_note.length - word.positive_note.length > 0);
    words2.sort((a, b) => {
      return (a.positive_note.length - a.negative_note.length) - (b.positive_note.length - b.negative_note.length);
    });
    return this.convertWordList(words2.slice(0, 100));
  }

  async createWord(wordData: word, bringToCSV: boolean = true) {
    const theme = await this.themeService.getThemeByName(wordData.theme);
    
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
    const word = await this.wordRepository.findOne({ where: { id }, relations: ['theme', 'positive_note', 'negative_note'] });
    if (word && user) {

      user.word_seeing.push(id);
      // await this.userService.updateUser(id, user);
      await this.userService.updateUser(user.id, user);

    }
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
