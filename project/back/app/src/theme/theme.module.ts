import { Module } from '@nestjs/common';
import { ThemeController } from './theme.controller';
import { ThemeService } from './theme.service';
import { Theme } from './theme.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Theme])],
  controllers: [ThemeController],
  providers: [ThemeService],
})
export class ThemeModule {}
