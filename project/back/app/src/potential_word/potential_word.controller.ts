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

  @Post()
  @UseGuards(AuthGuard)
  createPotentialWord(@Request() id, @Body() potentialWord: word) {
    console.log(id.user.username);
    console.log(potentialWord)
    return this.potentialWordService.createPotentialWord(potentialWord, id.user.username);
  }

  @Delete()
  @UseGuards(AuthGuard)
  validate(@Request() id) {
    console.log("JE SUIS LAAAA");
    if (id.user.role !== 'admin') throw new Error('You are not an admin');
    return this.potentialWordService.validatePotentialWord(id);
  }
}
