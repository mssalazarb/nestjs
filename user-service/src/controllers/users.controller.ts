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

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  saveGender(@Body() user: Users): Promise<GeneralResponse> {
    return this.usersService.saveUser(user);
  }

  @Put()
  updateGender(@Body() user: Users): Promise<GeneralResponse> {
    return this.usersService.updateUser(user);
  }

  @Delete()
  deleteGender(@Query('id') userId: number): Promise<GeneralResponse> {
    return this.usersService.deleteUser(userId);
  }

  @Get()
  getGenders(): Promise<GeneralResponse> {
    return this.usersService.getUsers();
  }
}
