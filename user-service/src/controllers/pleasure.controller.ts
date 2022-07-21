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
import { UserCards } from '../entities/user-cards.entity';
import { UserCardsService } from '../services/user-cards.service';
import { PleasuresService } from "../services/pleasures.service";
import { Pleasures } from "../entities/pleasures.entity";

@Controller('/pleasures')
export class PleasureController {
  constructor(private readonly pleasuresService: PleasuresService) {}

  @Post()
  savePleasure(@Body() pleasure: Pleasures): Promise<GeneralResponse> {
    return this.pleasuresService.savePleasure(pleasure);
  }

  @Put()
  updatePleasure(@Body() pleasure: Pleasures): Promise<GeneralResponse> {
    return this.pleasuresService.updatePleasure(pleasure);
  }

  @Delete()
  deleteCard(@Query('id') pleasureId: number): Promise<GeneralResponse> {
    return this.pleasuresService.deletePleasure(pleasureId);
  }

  @Get()
  getCardsByUser(): Promise<GeneralResponse> {
    return this.pleasuresService.getPleasures();
  }
}
