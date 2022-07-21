import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GeneralResponse } from '../models/general-response';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Pleasures } from '../entities/pleasures.entity';

@Injectable()
export class PleasuresService {
  constructor(
    @InjectRepository(Pleasures)
    private repository: Repository<Pleasures>,
    private dataSource: DataSource,
  ) {}

  async savePleasure(pleasure: Pleasures): Promise<GeneralResponse> {
    let oldPleasure;
    if (pleasure.value && pleasure.type) {
      oldPleasure = await this.searchPleasureByCriteria({
        value: pleasure.value,
        type: pleasure.type,
      });
    }

    if (oldPleasure) {
      throw new HttpException(
        'Error saving pleasure, the pleasure already exists',
        HttpStatus.CONFLICT,
      );
    }

    const data = await this.repository.save(pleasure);

    return {
      statusCode: HttpStatus.CREATED,
      data,
    };
  }

  async updatePleasure(pleasure: Pleasures): Promise<GeneralResponse> {
    if (pleasure.id) {
      let oldPleasure = await this.searchPleasureByCriteria({
        id: pleasure.id,
      });
      oldPleasure = Object.assign(oldPleasure, pleasure);

      return this.updateById(oldPleasure);
    } else {
      throw new HttpException('Error updating pleasure', HttpStatus.CONFLICT);
    }
  }

  async deletePleasure(pleasureId: number): Promise<GeneralResponse> {
    if (pleasureId) {
      const pleasure = await this.searchPleasureByCriteria({ id: pleasureId });
      pleasure.deletedAt = new Date();

      return this.updateById(pleasure);
    }
  }

  async getPleasures(): Promise<GeneralResponse> {
    const users = await this.dataSource
      .createQueryBuilder()
      .select('us.*')
      .from(Pleasures, 'us')
      .where('deleted_at is null')
      .getRawMany();

    return {
      statusCode: HttpStatus.OK,
      data: users,
    };
  }

  async searchPleasureByCriteria(criteria: any) {
    return this.dataSource
      .createQueryBuilder()
      .select('us.*')
      .from(Pleasures, 'us')
      .where(criteria)
      .andWhere('deleted_at is null')
      .getRawOne();
  }

  async updateById(card) {
    const data = await this.repository.update({ id: card.id }, card);

    return {
      statusCode: HttpStatus.OK,
      data: data.raw,
    };
  }
}
