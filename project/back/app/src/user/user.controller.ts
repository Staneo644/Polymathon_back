import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import {
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { jwtConstants } from 'src/auth/jwt.constant';
import { user_id } from 'src/entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() user: User) {
    console.log(user);
    console.log(jwtConstants);
    user.email = user.email.toLowerCase();
    return await this.userService.createUser(user);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return await this.userService.deleteUser(id);
  }

  @Get('email')
  @UseGuards(AuthGuard)
  async getUserEmail(@Request() id: any): Promise<user_id> {
    return await this.userService.getUserByEmail(id.user.username);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/password')
  async changePassword(
    @Param('id') id: number,
    @Body('newPassword') newPassword: string,
  ): Promise<void> {
    return await this.userService.changePassword(id, newPassword);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/email')
  async changeEmail(
    @Param('id') id: number,
    @Body('newEmail') newEmail: string,
  ): Promise<void> {
    newEmail = newEmail.toLowerCase();
    return await this.userService.changeEmail(id, newEmail);
  }

  @Get('isUser/:id')
  async isUser(@Param('id') id: number): Promise<boolean> {
    return await this.userService.isUser(id);
  }

  @Post('login')
  async login(@Body() user: User) {
    user.email = user.email.toLowerCase();
    return await this.userService.login(user);
  }
}
