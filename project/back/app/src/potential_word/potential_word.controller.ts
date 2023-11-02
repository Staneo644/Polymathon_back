import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { PotentialWordService } from './potential_word.service';
import { potential_word_id } from 'src/entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/decorator';

@Controller('potential-word')
export class PotentialWordController {
  constructor(private readonly potentialWordService: PotentialWordService) {}

  @Get()
  @UseGuards(AuthGuard)
  getPotentialWords(): Promise<potential_word_id[]> {
    return this.potentialWordService.getPotentialWords();
  }

  @Post()
  @UseGuards(AuthGuard)
  createPotentialWord(@GetUser('user') id, @Body() potentialWord) {
    console.log(id);

    return this.potentialWordService.createPotentialWord(potentialWord);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  validate(@Param('id') id) {
    return this.potentialWordService.validatePotentialWord(id);
  }
}
