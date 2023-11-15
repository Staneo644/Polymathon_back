import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PotentialWordService } from './potential_word.service';
import { potential_word_id, word } from 'src/entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/decorator';

@Controller('potential-word')
export class PotentialWordController {
  constructor(private readonly potentialWordService: PotentialWordService) {}

  @Get()
  getPotentialWords(): Promise<potential_word_id[]> {
    return this.potentialWordService.getPotentialWords();
  }

  @Post(':word')
  @UseGuards(AuthGuard)
  createPotentialWord(@Request() id:any, @Param('word')word:string, @Body() potentialWord: word) {
    console.log(id.user.username);
    potentialWord.name = potentialWord.name.toLowerCase();
    console.log(potentialWord)
    return this.potentialWordService.createPotentialWord(potentialWord, id.user.username, word);
  }

  @Delete()
  @UseGuards(AuthGuard)
  validate(@Request() id) {
    if (id.user.role !== 'admin') throw new Error('You are not an admin');
    return this.potentialWordService.validatePotentialWord(id);
  }
}
