import { Test, TestingModule } from '@nestjs/testing';
import { PotentialWordController } from './potential_word.controller';

describe('PotentialWordController', () => {
  let controller: PotentialWordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PotentialWordController],
    }).compile();

    controller = module.get<PotentialWordController>(PotentialWordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
