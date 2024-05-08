import { Reflector } from '@nestjs/core';
import { ApiKeyGuard } from './api-key.guard';
import { ConfigService } from '@nestjs/config';

describe('ApiKeyGuard', () => {
  let apiKeyGuard: ApiKeyGuard;

  beforeEach(async () => {
    apiKeyGuard = new ApiKeyGuard(new Reflector(), new ConfigService());
  });

  it('should be defined', () => {
    expect(apiKeyGuard).toBeDefined();
  });
});
