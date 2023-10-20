import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { WordModule } from './word/word.module';
import { UserModule } from './user/user.module';
import { PotentialWordModule } from './potential_word/potential_word.module';
import { ThemeModule } from './theme/theme.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    DatabaseModule,
    WordModule,
    UserModule,
    PotentialWordModule,
    ThemeModule,
    AuthModule,
  ],
  providers: [AuthService, JwtStrategy],
})
export class AppModule {}
