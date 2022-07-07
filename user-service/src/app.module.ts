import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { HealthCheckController } from './controllers/health-check.controller';
import { HealthCheckService } from './services/health-check.service';
import { GenderTypes1656968026507 } from './database/1656968026507-GenderTypes';
import { User1656968511358 } from './database/1656968511358-User';
import { UserAddresses1656968665228 } from './database/1656968665228-UserAddresses';
import { UserCards1656969082536 } from './database/1656969082536-UserCards';
import { Pleasures1656969659649 } from './database/1656969659649-Pleasures';
import { UserPleasures1656969668377 } from './database/1656969668377-UserPleasures';
import { GenderTypeController } from './controllers/gender-type.controller';
import { GenderTypeService } from './services/gender-type.service';
import { GenderTypes } from './entities/gender-types.entity';
import { Users } from './entities/users.entity';
import { UserAddresses } from './entities/user-addresses.entity';
import { UserCards } from './entities/user-cards.entity';
import { UserPleasures } from './entities/user-pleasures.entity';
import { Pleasures } from './entities/pleasures.entity';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      GenderTypes,
      Users,
      UserAddresses,
      UserCards,
      UserPleasures,
      Pleasures,
    ]),
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
        entities: [
          GenderTypes,
          Users,
          UserAddresses,
          UserCards,
          UserPleasures,
          Pleasures,
        ],
        migrations: [
          GenderTypes1656968026507,
          User1656968511358,
          UserAddresses1656968665228,
          UserCards1656969082536,
          Pleasures1656969659649,
          UserPleasures1656969668377,
        ],
        synchronize: true,
        migrationsRun: true,
      }),
      dataSourceFactory: async (options) => {
        return await new DataSource(options).initialize();
      },
    }),
  ],
  controllers: [HealthCheckController, GenderTypeController, UsersController],
  providers: [HealthCheckService, GenderTypeService, UsersService],
})
export class AppModule {}
