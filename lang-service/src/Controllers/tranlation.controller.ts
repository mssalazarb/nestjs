import { Body, Controller, Post } from "@nestjs/common";
import { TranslationService } from '../Services/translation.service';

@Controller('/translations')
export class TranlationController {
  constructor(private readonly translationService: TranslationService) {}

  @Post()
  saveTranslations(@Body() sendGrid: SendGridTemplate): string {
    return 'I am alive!';
  }

  updateTranslations(): string {}

  getTranslations(): string {}

  deleteTranslations(): string {}
}
