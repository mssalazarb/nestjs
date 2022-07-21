import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GeneralResponse } from '../models/general-response';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserAddresses } from '../entities/user-addresses.entity';

@Injectable()
export class UserAddressesService {
  constructor(
    @InjectRepository(UserAddresses)
    private repository: Repository<UserAddresses>,
    private dataSource: DataSource,
  ) {}

  async saveAddress(address: UserAddresses): Promise<GeneralResponse> {
    let oldAddress;
    if (address.lat && address.lng) {
      oldAddress = await this.searchAddressByCriteria({
        lat: address.lat,
        lng: address.lng,
      });
    }

    if (oldAddress) {
      throw new HttpException(
        'Error saving address, the user already have this address',
        HttpStatus.CONFLICT,
      );
    }

    const data = await this.repository.save(address);

    return {
      statusCode: HttpStatus.CREATED,
      data,
    };
  }

  async updateAddress(address: UserAddresses): Promise<GeneralResponse> {
    if (address.id) {
      let oldAddress = await this.searchAddressByCriteria({ id: address.id });
      oldAddress = Object.assign(oldAddress, address);

      return this.updateById(oldAddress);
    } else {
      throw new HttpException('Error updating address', HttpStatus.CONFLICT);
    }
  }

  async setAddressDefault(addressId: number): Promise<GeneralResponse> {
    if (addressId) {
      const oldAddress = await this.searchAddressByCriteria({ default: true });
      oldAddress.default = false;
      await this.updateById(oldAddress);

      const address = await this.searchAddressByCriteria({ id: addressId });
      address.default = true;

      return this.updateById(address);
    } else {
      throw new HttpException('Error updating address', HttpStatus.CONFLICT);
    }
  }

  async deleteAddress(addressId: number): Promise<GeneralResponse> {
    if (addressId) {
      const address = await this.searchAddressByCriteria({ id: addressId });
      address.deletedAt = new Date();

      return this.updateById(address);
    }
  }

  async getAdddressByUser(userId: number): Promise<GeneralResponse> {
    const users = await this.dataSource
      .createQueryBuilder()
      .select('us.*')
      .from(UserAddresses, 'us')
      .where('deleted_at is null')
      .andWhere({ user_id: userId })
      .getRawMany();

    return {
      statusCode: HttpStatus.OK,
      data: users,
    };
  }

  async searchAddressByCriteria(criteria: any) {
    return this.dataSource
      .createQueryBuilder()
      .select('us.*')
      .from(UserAddresses, 'us')
      .where(criteria)
      .andWhere('deleted_at is null')
      .getRawOne();
  }

  async updateById(address) {
    const data = await this.repository.update({ id: address.id }, address);

    return {
      statusCode: HttpStatus.OK,
      data: data.raw,
    };
  }
}
