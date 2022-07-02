import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthCheckController } from './controllers/health-check.controller';
import { HealthCheckService } from './services/health-check.service';
import { DataSource } from 'typeorm';
import { TranslationController } from './controllers/translation.controller';
import { TranslationService } from './services/translation.service';
import { Translations } from './entities/translations.entity';
import { Translations1656476750649 } from './database/1656476750649-Translations';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Translations]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Translations],
        migrations: [Translations1656476750649],
        synchronize: true,
        migrationsRun: true,
      }),
      dataSourceFactory: async (options) => {
        return await new DataSource(options).initialize();
      },
    }),
  ],
  controllers: [HealthCheckController, TranslationController],
  providers: [HealthCheckService, TranslationService],
})
export class AppModule {}
