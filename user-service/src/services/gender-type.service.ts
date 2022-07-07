import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GeneralResponse } from '../models/general-response';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { GenderTypes } from '../entities/gender-types.entity';

@Injectable()
export class GenderTypeService {
  constructor(
    @InjectRepository(GenderTypes)
    private repository: Repository<GenderTypes>,
    private dataSource: DataSource,
  ) {}

  async saveGender(gender: GenderTypes): Promise<GeneralResponse> {
    if (gender.value) {
      await this.searchGenderByValue(gender.value);
      const data = await this.repository.save(gender);

      return {
        statusCode: HttpStatus.CREATED,
        data,
      };
    }
  }

  async updateGender(gender: GenderTypes): Promise<GeneralResponse> {
    if (gender.id) {
      const newGender = await this.searchGenderById(gender.id);
      newGender.value = gender.value;

      return this.updateById(newGender);
    } else {
      throw new HttpException('Error updating gender', HttpStatus.CONFLICT);
    }
  }

  async deleteGender(genderId: number): Promise<GeneralResponse> {
    if (genderId) {
      await this.repository.delete({ id: genderId });

      return {
        statusCode: HttpStatus.OK,
      };
    }
  }

  async getGenders(): Promise<GeneralResponse> {
    const genders = await this.dataSource
      .createQueryBuilder()
      .select('gr.*')
      .from(GenderTypes, 'gr')
      .getRawMany();

    return {
      statusCode: HttpStatus.OK,
      data: genders,
    };
  }

  async searchGenderByValue(value: string) {
    const gender = await this.searchGenderByCriteria({ value: value });

    if (gender) {
      throw new HttpException(
        'Error saving gender, the gender already exists',
        HttpStatus.CONFLICT,
      );
    }
  }

  async searchGenderById(genderId: number) {
    const gender = await this.dataSource
      .createQueryBuilder()
      .select('gr')
      .from(GenderTypes, 'gr')
      .where('id = :id', { id: genderId })
      .getOne();

    if (!gender) {
      throw new HttpException('Error updating gender', HttpStatus.CONFLICT);
    }

    return gender;
  }

  async searchGenderByCriteria(criteria: any) {
    return this.dataSource
      .createQueryBuilder()
      .select('gr.*')
      .from(GenderTypes, 'gr')
      .where(criteria)
      .getRawOne();
  }

  async updateById(gender) {
    const data = await this.repository.update({ id: gender.id }, gender);

    return {
      statusCode: HttpStatus.OK,
      data: data.raw,
    };
  }
}
