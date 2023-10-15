import { Repository } from 'typeorm';
import { Word } from './word';
export declare class WordService {
    private readonly wordRepository;
    constructor(wordRepository: Repository<Word>);
    getRandomWord(): Promise<Word>;
    note_word(note: boolean, id: number): Promise<Word>;
    getWordById(id: number): Promise<Word>;
    createWord(wordData: Word): Promise<Word>;
    updateWord(id: number, wordData: Word): Promise<Word>;
    deleteWord(id: number): Promise<boolean>;
    getWordByName(name: string): Promise<Word>;
    getAllWords(): Promise<Word[]>;
}
