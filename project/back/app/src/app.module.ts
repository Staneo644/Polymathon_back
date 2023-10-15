import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { WordModule } from './word/word.module';
import { UserModule } from './user/user.module';
import { PotentialWordModule } from './potential_word/potential_word.module';
import { ThemeModule } from './theme/theme.module';


@Module({
  imports: [DatabaseModule, WordModule, UserModule, PotentialWordModule, ThemeModule],
})
export class AppModule {}
