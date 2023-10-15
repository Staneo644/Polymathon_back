import { Test, TestingModule } from '@nestjs/testing';
import { WordController } from './word.controller';
import { WordService } from './word.service';
import { NotFoundException } from '@nestjs/common';
import { WordModule } from './word.module';


describe('WordController', () => {
  let wordController: WordController;
  let wordService: WordService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [WordModule],
      controllers: [WordController],
      providers: [WordService],
    }).compile();

    wordService = moduleRef.get<WordService>(WordService);
    wordController = moduleRef.get<WordController>(WordController);
  });

  describe('getRandomWord', () => {
    it('should return a random word', async () => {
      const mockWord = {name: 'test', definition: 'test', positive_note: 0, negative_note: 0, etymology: 'test', gender: 'nm', theme: undefined, id: 1};
      jest.spyOn(wordService, 'getRandomWord').mockResolvedValue(mockWord);

      expect(await wordController.getRandomWord()).toBe(mockWord);
    });

    it('should throw a NotFoundException if no random word is found', async () => {
      jest.spyOn(wordService, 'getRandomWord').mockResolvedValue(null);

      await expect(wordController.getRandomWord()).rejects.toThrow(NotFoundException);
    });
  });

  describe('note_word', () => {
    it('should note a word', async () => {
      const mockWord = {name: 'test', definition: 'test', positive_note: 0, negative_note: 0, etymology: 'test', gender: 'nm', theme: undefined, id: 1};
      jest.spyOn(wordService, 'note_word').mockResolvedValue(mockWord);

      expect(await wordController.note_word(true, 1)).toBe(mockWord);
    });

    it('should throw a NotFoundException if the word is not found', async () => {
      jest.spyOn(wordService, 'note_word').mockResolvedValue(null);

      await expect(wordController.note_word(true, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateWord', () => {
    it('should update a word', async () => {
      const mockWord = {name: 'test', definition: 'test', positive_note: 0, negative_note: 0, etymology: 'test', gender: 'nm', theme: undefined, id: 1};
      
      jest.spyOn(wordService, 'updateWord').mockResolvedValue(mockWord);

      expect(await wordController.updateWord(1, mockWord)).toBe(mockWord);
    });

    it('should throw a NotFoundException if the word is not found', async () => {
      jest.spyOn(wordService, 'updateWord').mockResolvedValue(null);

      await expect(wordController.updateWord(1, {name: 'test', definition: 'test', positive_note: 0, negative_note: 0, etymology: 'test', gender: 'nm', theme: undefined, id: 1}
      )).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteWord', () => {
    it('should delete a word', async () => {
      jest.spyOn(wordService, 'deleteWord').mockResolvedValue(true);

      expect(await wordController.deleteWord(1)).toEqual({ message: 'Word deleted successfully' });
    });

    it('should throw a NotFoundException if the word is not found', async () => {
      jest.spyOn(wordService, 'deleteWord').mockResolvedValue(false);

      await expect(wordController.deleteWord(1)).rejects.toThrow(NotFoundException);
    });
  });
});