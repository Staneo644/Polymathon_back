import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PotentialWord } from './potential_word.entity';
import { WordService } from '../word/word.service';
import { definition_wik, potential_word_id } from 'src/entity';

@Injectable()
export class PotentialWordService {
  constructor(
    @InjectRepository(PotentialWord)
    private readonly potentialWordRepository: Repository<PotentialWord>,
    private readonly wordService: WordService,
  ) {}

  removeHtmlTags(input: string): string {
    const regex = /<[^>]*>/g;
    return input.replace(regex, '');
  }

  decodeHTMLEntities(input: string): string | null {
    const doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.documentElement.textContent;
  }

  async getDefinition(word: string): Promise<definition_wik[]> {
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
    if (jsonData.error !== '') {
      throw new Error(jsonData.error);
    }
    const natureDef = jsonData.natureDef;
    const nature = jsonData.nature;

    const extractedDefinitions: definition_wik[] = [];
    for (let index = 0; index < natureDef.length; index++) {
      natureDef[index].forEach((definitionObj: { [key: string]: string }) => {
        let result: definition_wik = { definition: [], nature: '' };
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

  async getPotentialWords(): Promise<potential_word_id[]> {
    const res = await this.potentialWordRepository.find();
    let potentialWords: potential_word_id[] = [];
    for (const potentialWord of res) {
      potentialWords.push({
        id: potentialWord.id,
        name: potentialWord.name,
        definition: potentialWord.definition,
        gender: potentialWord.gender,
        theme: potentialWord.theme,
        etymology: potentialWord.etymology,
        user: potentialWord.user.email,
        wiki_def: await this.getDefinition(potentialWord.name),
      });
    }
    return potentialWords;
  }

  async createPotentialWord(potentialWordData) {
    const potentialWord =
      this.potentialWordRepository.create(potentialWordData);
    return this.potentialWordRepository.save(potentialWord);
  }

  async validatePotentialWord(id) {
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
