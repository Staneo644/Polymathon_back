import { Controller } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { Param } from '@nestjs/common';
import { Word } from 'src/word/word.entity';
import { theme_id } from 'src/entity';
import { Get } from '@nestjs/common';

@Controller('theme')
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @Get()
  async getThemes(): Promise<theme_id[]> {
    return this.themeService.getThemes();
  }

  // @Post()
  // public async addTheme(@Body() themeData: theme): Promise<Theme> {
  //   themeData.name = themeData.name.toLowerCase();
  //   return this.themeService.addTheme(themeData);
  // }

  // @Delete(':id')
  // async deleteTheme(@Param('id') themeId: number): Promise<void> {
  //   return this.themeService.deleteTheme(themeId);
  // }

  @Get(':id/random-word')
  async getRandomWordByTheme(@Param('id') themeId: number): Promise<Word[]> {
    return this.themeService.getRandomWordsByTheme(themeId);
  }

  // @Post('admin')
  // @UseGuards(AuthGuard)
  // async refreshThemeAdmin(): Promise<Theme> {

  // }
}
