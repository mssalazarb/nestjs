import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckController } from './health-check.controller';
import { HealthCheckService } from './health-check.service';

describe('HealthCheckController', () => {
  let healthController: HealthCheckController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthCheckController],
      providers: [HealthCheckService],
    }).compile();

    healthController = app.get<HealthCheckController>(HealthCheckController);
  });

  describe('Health Check Test', () => {
    it('Should check if the microservice is alive', () => {
      expect(healthController.healthCheck()).toBe('I am alive!');
    });
  });
});
