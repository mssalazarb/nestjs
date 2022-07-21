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

@Controller('/cards')
export class UserCardsController {
  constructor(private readonly cardService: UserCardsService) {}

  @Post()
  saveCard(@Body() card: UserCards): Promise<GeneralResponse> {
    return this.cardService.saveCard(card);
  }

  @Put()
  updateCard(@Body() card: UserCards): Promise<GeneralResponse> {
    return this.cardService.updateCard(card);
  }

  @Put('/default')
  setCardDefault(@Query('id') cardId: number): Promise<GeneralResponse> {
    return this.cardService.setCardDefault(cardId);
  }

  @Delete()
  deleteCard(@Query('id') cardId: number): Promise<GeneralResponse> {
    return this.cardService.deleteCard(cardId);
  }

  @Get()
  getCardsByUser(@Query('id') userId: number): Promise<GeneralResponse> {
    return this.cardService.getCardsByUser(userId);
  }
}
