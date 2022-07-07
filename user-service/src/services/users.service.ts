import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GeneralResponse } from '../models/general-response';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import PasswordUtil from '../utils/password-util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private repository: Repository<Users>,
    private dataSource: DataSource,
  ) {}

  async saveUser(user: Users): Promise<GeneralResponse> {
    let oldUser;
    if (user.telephone) {
      oldUser = await this.searchUserByCriteria({ telephone: user.telephone });
    } else if (user.email) {
      oldUser = await this.searchUserByCriteria({ email: user.email });
    }

    if (oldUser) {
      throw new HttpException(
        'Error saving user, the user already exists',
        HttpStatus.CONFLICT,
      );
    }

    user.password = await PasswordUtil.encryptPassword(user.password);
    const { id, name, lastName } = await this.repository.save(user);
    //TODO envio de mensaje concodigo de validacion para registro o verificacion de correo

    return {
      statusCode: HttpStatus.CREATED,
      data: {
        id,
        name,
        lastName,
      },
    };
  }

  async updateUser(user: Users): Promise<GeneralResponse> {
    if (user.id) {
      let oldUser = await this.searchUserById(user.id);
      oldUser = Object.assign(oldUser, user);

      return this.updateById(oldUser);
    } else {
      throw new HttpException('Error updating user', HttpStatus.CONFLICT);
    }
  }

  async deleteUser(userId: number): Promise<GeneralResponse> {
    if (userId) {
      const user = await this.searchUserById(userId);
      user.deletedAt = new Date();

      return this.updateById(user);
    }
  }

  async getUsers(): Promise<GeneralResponse> {
    const users = await this.dataSource
      .createQueryBuilder()
      .select('us.*')
      .from(Users, 'us')
      .where('deleted_at is null')
      .getRawMany();

    return {
      statusCode: HttpStatus.OK,
      data: users,
    };
  }

  async searchUserById(userId: number) {
    const user = await this.dataSource
      .createQueryBuilder()
      .select('us')
      .from(Users, 'us')
      .where({ id: userId })
      .getOne();

    if (!user) {
      throw new HttpException(
        'Error updating translation',
        HttpStatus.CONFLICT,
      );
    }

    return user;
  }

  async searchUserByCriteria(criteria: any) {
    return this.dataSource
      .createQueryBuilder()
      .select('us.*')
      .from(Users, 'us')
      .where(criteria)
      .andWhere('deleted_at is null')
      .getRawOne();
  }

  async updateById(user) {
    const data = await this.repository.update({ id: user.id }, user);

    return {
      statusCode: HttpStatus.OK,
      data: data.raw,
    };
  }
}
