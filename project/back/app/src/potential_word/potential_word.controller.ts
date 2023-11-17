import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PotentialWordService } from './potential_word.service';
import { potential_word_id, word } from 'src/entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('potential-word')
export class PotentialWordController {
  constructor(private readonly potentialWordService: PotentialWordService) {}

  @Get()
  getPotentialWords(): Promise<potential_word_id[]> {
    return this.potentialWordService.getPotentialWords();
  }

  // @Get()
  // getPotentialWord(): Promise<potential_word_id> {
  //   return this.potentialWordService.getPotentialWord();
  // }

  @Post(':word_id')
  @UseGuards(AuthGuard)
  createPotentialWord(
    @Request() id: any,
    @Param('word_id') word_id: number,
    @Body() potentialWord: word,
  ) {
    console.log(id.user.username);
    potentialWord.name = potentialWord.name.toLowerCase();
    console.log(potentialWord);
    return this.potentialWordService.createPotentialWord(
      potentialWord,
      id.user.username,
      word_id,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  reject(@Request() id, @Param('id') id_potential_word: number) {
    if (id.user.role !== 'admin') throw new Error('You are not an admin');
    this.potentialWordService.deletePotentialWord(id_potential_word);
  }

  @Post('validate/:id')
  @UseGuards(AuthGuard)
  validate(
    @Request() id,
    @Param('id') id_potential_word: number,
    @Body() potentialWord: word,
  ) {
    if (id.user.role !== 'admin') throw new Error('You are not an admin');
    try {
      this.potentialWordService.validatePotentialWord(
        id_potential_word,
        potentialWord,
      );
    } catch (error) {
      console.log(error);
    }
  }
}
