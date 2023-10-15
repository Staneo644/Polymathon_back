import { Test, TestingModule } from '@nestjs/testing';
import { WordService } from './word.service';
import { WordController } from './word.controller';
import { WordModule } from './word.module';

describe('WordService', () => {
  let service: WordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WordModule],
      controllers: [WordController],
      providers: [WordService],
    }).compile();

    service = module.get<WordService>(WordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
