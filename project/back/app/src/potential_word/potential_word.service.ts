import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PotentialWord } from './potential_word.entity';
import { WordService } from '../word/word.service';
import { definition_wik, potential_word_id, word } from 'src/entity';
import { UserService } from 'src/user/user.service';
import * as cheerio from 'cheerio';

@Injectable()
export class PotentialWordService {
  constructor(
    @InjectRepository(PotentialWord)
    private readonly potentialWordRepository: Repository<PotentialWord>,
    private readonly wordService: WordService,
    private readonly userService: UserService
  ) {}

  removeHtmlTags(input: string): string {
    const regex = /<[^>]*>/g;
    return input.replace(regex, '');
  }

  decodeHTMLEntities(input: string): string | null {
    const $ = cheerio.load(input);
  return $.html();
    //return doc.documentElement.textContent;
  }

  async getDefinition(word: string): Promise<definition_wik[]> {
    try {

      const response = await fetch('http://localhost:8081/app/api_wiki.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: 'motWiki=' + word,
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const jsonData = await response.json();
    console.log(jsonData);
    if ( jsonData.error !== '' || response.status !== 200 || jsonData.natureDef === undefined) {
      return ([])
    }
    const natureDef = jsonData.natureDef;
    const nature = jsonData.nature;
    
    const extractedDefinitions: definition_wik[] = [];
    for (let index = 0; index < natureDef.length; index++) {
      natureDef[index].forEach((definitionObj: { [key: string]: string }) => {
        const result: definition_wik = { definition: [], nature: '' };
        result.nature = nature[index];
        console.log('objet def', definitionObj);
        const definition: string[] = [];
        for (const key in definitionObj) {
          const temp = this.decodeHTMLEntities(
            this.removeHtmlTags(definitionObj[key]),
            );
            if (temp) definition.push(temp);
          }
          result.definition = definition;
          extractedDefinitions.push(result);
          console.log(result);
        });
      }
      return extractedDefinitions;
    }
      catch (e) {
        console.log(e);
      }
  }

  async getPotentialWords(): Promise<potential_word_id[]> {
    const res = await this.potentialWordRepository.find();
    const potentialWords: potential_word_id[] = [];
    for (const potentialWord of res) {
      potentialWords.push({
        id: potentialWord.id,
        name: potentialWord.name,
        definition: potentialWord.definition,
        gender: potentialWord.gender,
        example: potentialWord.example,
        theme: potentialWord.theme,
        etymology: potentialWord.etymology,
        user: potentialWord.user?.email,
        wiki_def: await this.getDefinition(potentialWord.name),
      });
    }
    return potentialWords;
  }

  async createPotentialWord(potentialWordData: word, user:string, word:string) {
    if (await this.wordService.getWordByName(word) || await this.wordService.getWordByName(potentialWordData.name)) {
      throw new Error('Word already exists');
    }
    const potentialWord =
      this.potentialWordRepository.create(potentialWordData);
      potentialWord.user = await this.userService.getUserByEmail(user);
      console.log(potentialWord);
    return this.potentialWordRepository.save(potentialWord);
  }

  async validatePotentialWord(id:number) {
    const potentialWord = await this.potentialWordRepository.findOne({
      where: { id },
    });
    if (potentialWord == null) {
      return false;
    }
    await this.wordService.createWord(potentialWord);
    await this.potentialWordRepository.delete(id);
  }
}
