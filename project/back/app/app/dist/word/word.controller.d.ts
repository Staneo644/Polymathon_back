import { WordService } from './word.service';
import { Word } from './word';
export declare class WordController {
    private readonly wordService;
    constructor(wordService: WordService);
    getRandomWord(): Promise<Word>;
    note_word(note: boolean, id: number): Promise<Word>;
    updateWord(id: number, wordData: Word): Promise<Word>;
    deleteWord(id: number): Promise<{
        message: string;
    }>;
    getWordByName(name: string): Promise<Word>;
    getAllWords(): Promise<Word[]>;
}
