import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { GeneralResponse } from '../models/general-response';
import { UsersService } from '../services/users.service';
import { Users } from '../entities/users.entity';
import { UserPassword } from '../models/user-password';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  saveUser(@Body() user: Users): Promise<GeneralResponse> {
    return this.usersService.saveUser(user);
  }

  @Put()
  updateUser(@Body() user: Users): Promise<GeneralResponse> {
    return this.usersService.updateUser(user);
  }

  @Put('/password')
  updatePassword(@Body() user: UserPassword): Promise<GeneralResponse> {
    return this.usersService.updatePassword(user);
  }

  @Delete()
  deleteUser(@Query('id') userId: number): Promise<GeneralResponse> {
    return this.usersService.deleteUser(userId);
  }

  @Get()
  getUsers(): Promise<GeneralResponse> {
    return this.usersService.getUsers();
  }
}
