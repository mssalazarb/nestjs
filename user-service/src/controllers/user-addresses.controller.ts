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
import { UserAddressesService } from '../services/user-addresses.service';
import { UserAddresses } from '../entities/user-addresses.entity';

@Controller('/address')
export class UserAddressesController {
  constructor(private readonly addressesService: UserAddressesService) {}

  @Post()
  saveAddress(@Body() address: UserAddresses): Promise<GeneralResponse> {
    return this.addressesService.saveAddress(address);
  }

  @Put()
  updateAddress(@Body() address: UserAddresses): Promise<GeneralResponse> {
    return this.addressesService.updateAddress(address);
  }

  @Put('/default')
  setAddressDefault(@Query('id') addressId: number): Promise<GeneralResponse> {
    return this.addressesService.setAddressDefault(addressId);
  }

  @Delete()
  deleteAddress(@Query('id') addressId: number): Promise<GeneralResponse> {
    return this.addressesService.deleteAddress(addressId);
  }

  @Get()
  getAdddressByUser(@Query('id') userId: number): Promise<GeneralResponse> {
    return this.addressesService.getAdddressByUser(userId);
  }
}
