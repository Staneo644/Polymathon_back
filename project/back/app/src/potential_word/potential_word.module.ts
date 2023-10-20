import { Module } from '@nestjs/common';
import { PotentialWordController } from './potential_word.controller';
import { PotentialWordService } from './potential_word.service';
import { PotentialWord } from './potential_word.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PotentialWord])],
  controllers: [PotentialWordController],
  providers: [PotentialWordService],
})
export class PotentialWordModule {}
