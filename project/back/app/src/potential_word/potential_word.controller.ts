import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PotentialWordService } from './potential_word.service';
import { potential_word_id } from 'src/entity';

@Controller('potential-word')
export class PotentialWordController {
  constructor(private readonly potentialWordService: PotentialWordService) {}

  @Get()
  getPotentialWords(): Promise<potential_word_id[]> {
    return this.potentialWordService.getPotentialWords();
  }

  @Post()
  createPotentialWord(@Body() potentialWord) {
    return this.potentialWordService.createPotentialWord(potentialWord);
  }

  @Delete(':id')
  validate(@Param('id') id) {
    return this.potentialWordService.validatePotentialWord(id);
  }
}
