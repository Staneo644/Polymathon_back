import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { WordModule } from './word/word.module';
import { UserModule } from './user/user.module';
import { PotentialWordModule } from './potential_word/potential_word.module';
import { ThemeModule } from './theme/theme.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/jwt.constant';
import { MailerModule } from '@nestjs-modules/mailer';

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
    MailerModule.forRoot({
      transport: {
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
  ],
})
export class AppModule {}
