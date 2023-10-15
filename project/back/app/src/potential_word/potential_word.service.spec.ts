import { Test, TestingModule } from '@nestjs/testing';
import { PotentialWordService } from './potential_word.service';

describe('PotentialWordService', () => {
  let service: PotentialWordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PotentialWordService],
    }).compile();

    service = module.get<PotentialWordService>(PotentialWordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
