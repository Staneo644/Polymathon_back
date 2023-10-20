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
  NotFoundException,
} from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createUser(@Body() user: User): Promise<User> {
    return this.userService.createUser(user);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }

  @Patch(':id/password')
  changePassword(
    @Param('id') id: number,
    @Body('newPassword') newPassword: string,
  ): Promise<void> {
    return this.userService.changePassword(id, newPassword);
  }

  @Patch(':id/email')
  changeEmail(
    @Param('id') id: number,
    @Body('newEmail') newEmail: string,
  ): Promise<void> {
    return this.userService.changeEmail(id, newEmail);
  }

  @Get(':id')
  isUser(@Param('id') id: number): Promise<boolean> {
    return this.userService.isUser(id);
  }
}
