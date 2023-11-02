import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { WordModule } from './word/word.module';
import { UserModule } from './user/user.module';
import { PotentialWordModule } from './potential_word/potential_word.module';
import { ThemeModule } from './theme/theme.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConstants } from './auth/jwt.constant';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
        secret: jwtConstants.secret,
    }),
    WordModule,
    UserModule,
    PotentialWordModule,
    ThemeModule,
  ]
})
export class AppModule {}
