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
import { GenderTypes } from '../entities/gender-types.entity';
import { GenderTypeService } from '../services/gender-type.service';

@Controller('/genders')
export class GenderTypeController {
  constructor(private readonly genderTypeServiceService: GenderTypeService) {}

  @Post()
  saveGender(@Body() gender: GenderTypes): Promise<GeneralResponse> {
    return this.genderTypeServiceService.saveGender(gender);
  }

  @Put()
  updateGender(@Body() gender: GenderTypes): Promise<GeneralResponse> {
    return this.genderTypeServiceService.updateGender(gender);
  }

  @Delete()
  deleteGender(@Query('id') genderId: number): Promise<GeneralResponse> {
    return this.genderTypeServiceService.deleteGender(genderId);
  }

  @Get()
  getGenders(): Promise<GeneralResponse> {
    return this.genderTypeServiceService.getGenders();
  }
}
