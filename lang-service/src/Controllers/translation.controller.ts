import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TranslationService } from '../services/translation.service';
import { Translations } from '../entities/translations.entity';
import { GeneralResponse } from '../models/general-response';

@Controller('/translations')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Post()
  saveTranslations(
    @Body() translations: Array<Translations>,
  ): Promise<GeneralResponse> {
    return this.translationService.saveTranslations(translations);
  }

  @Put()
  updateTranslation(
    @Body() translation: Translations,
  ): Promise<GeneralResponse> {
    return this.translationService.updateTranslation(translation);
  }

  @Delete()
  deleteTranslation(
    @Query('id') translationId: number,
  ): Promise<GeneralResponse> {
    return this.translationService.deleteTranslation(translationId);
  }

  @Get('/group')
  getTranslationsByGroup(
    @Query('group') group: string,
  ): Promise<GeneralResponse> {
    return this.translationService.getTranslationsByGroup(group);
  }

  @Get('/key')
  getTranslationsByKey(
    @Query('key') keyWord: string,
  ): Promise<GeneralResponse> {
    return this.translationService.getTranslationsByKey(keyWord);
  }
}
