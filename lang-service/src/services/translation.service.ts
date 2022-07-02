import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Translations } from '../entities/translations.entity';
import { GeneralResponse } from '../models/general-response';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TranslationService {
  constructor(
    @InjectRepository(Translations)
    private repository: Repository<Translations>,
    private dataSource: DataSource,
  ) {}

  async saveTranslations(
    translations: Array<Translations>,
  ): Promise<GeneralResponse> {
    const keyWord = translations[0].keyWord;

    if (keyWord) {
      await this.searchTranslatesByKey(keyWord);
      const data = await this.repository.save(translations);

      return {
        statusCode: HttpStatus.CREATED,
        data,
      };
    }
  }

  async updateTranslation(translation: Translations): Promise<GeneralResponse> {
    if (translation.id) {
      const translate = await this.searchTranslateById(translation.id);
      translate.value = translation.value;
      translate.updatedAt = new Date();

      return this.updateById(translate);
    } else {
      throw new HttpException(
        'Error updating translation',
        HttpStatus.CONFLICT,
      );
    }
  }

  async deleteTranslation(translationId: number): Promise<GeneralResponse> {
    if (translationId) {
      const translate = await this.searchTranslateById(translationId);
      translate.deletedAt = new Date();

      return this.updateById(translate);
    }
  }

  async getTranslationsByGroup(groupKey: string): Promise<GeneralResponse> {
    if (groupKey) {
      const translates = await this.searchTranslatesByCriteria({
        group: groupKey,
      });

      return {
        statusCode: HttpStatus.OK,
        data: translates,
      };
    }
  }

  async getTranslationsByKey(key: string): Promise<GeneralResponse> {
    if (key) {
      const translates = await this.searchTranslatesByCriteria({
        keyWord: key,
      });

      return {
        statusCode: HttpStatus.OK,
        data: translates,
      };
    }
  }

  async searchTranslatesByKey(key: string) {
    const translates = await this.searchTranslatesByCriteria({ keyWord: key });

    if (translates.length) {
      throw new HttpException(
        'Error saving translations, the key word already exists',
        HttpStatus.CONFLICT,
      );
    }
  }

  async searchTranslateById(translateId: number) {
    const translate = await this.dataSource
      .createQueryBuilder()
      .select('tr')
      .from(Translations, 'tr')
      .where('id = :id', { id: translateId })
      .andWhere('deleted_at is null')
      .getOne();

    if (!translate) {
      throw new HttpException(
        'Error updating translation',
        HttpStatus.CONFLICT,
      );
    }

    return translate;
  }

  async searchTranslatesByCriteria(criteria: any) {
    return this.dataSource
      .createQueryBuilder()
      .select('tr.*')
      .from(Translations, 'tr')
      .where(criteria)
      .andWhere('deleted_at is null')
      .getRawMany();
  }

  async updateById(translate) {
    const data = await this.repository.update({ id: translate.id }, translate);

    return {
      statusCode: HttpStatus.OK,
      data: data.raw,
    };
  }
}
