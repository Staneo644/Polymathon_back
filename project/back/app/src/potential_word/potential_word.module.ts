import { Module } from '@nestjs/common';
import { PotentialWordController } from './potential_word.controller';
import { PotentialWordService } from './potential_word.service';

@Module({
  controllers: [PotentialWordController],
  providers: [PotentialWordService]
})
export class PotentialWordModule {}
