import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpMail {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getAllTemplates() {
    const apiKey = this.configService.get<string>('SEND_GRID_API_KEY');
    const sendGridUrl = this.configService.get<string>('SEND_GRID_URL');

    return firstValueFrom(
      this.httpService.get(`${sendGridUrl}/templates`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        params: {
          generations: 'dynamic',
        },
        timeout: 3000,
      }),
    );
  }
}
