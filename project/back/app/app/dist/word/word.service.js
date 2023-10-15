"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const word_1 = require("./word");
const common_2 = require("@nestjs/common");
let WordService = exports.WordService = class WordService {
    constructor(wordRepository) {
        this.wordRepository = wordRepository;
    }
    async getRandomWord() {
        const itemCount = await this.wordRepository.count();
        if (itemCount == 0)
            throw new common_2.NotFoundException('No random word found.');
        const randomIndex = Math.floor(Math.random() * itemCount);
        const randomWord = await this.wordRepository.query(`SELECT * FROM items OFFSET ${randomIndex} LIMIT 1`);
        return randomWord;
    }
    async note_word(note, id) {
        const word = await this.wordRepository.findOne({ where: { id } });
        if (note) {
            word.positive_note += 1;
        }
        else {
            word.negative_note += 1;
        }
        await this.wordRepository.update(id, word);
        return word;
    }
    async getWordById(id) {
        return this.wordRepository.findOne({ where: { id } });
    }
    async createWord(wordData) {
        return this.wordRepository.save(wordData);
    }
    async updateWord(id, wordData) {
        await this.getWordById(id);
        await this.wordRepository.update(id, wordData);
        return this.getWordById(id);
    }
    async deleteWord(id) {
        try {
            if (this.getWordById(id) == null) {
                throw new common_2.NotFoundException('Word not found.');
            }
            const result = await this.wordRepository.delete(id);
            return result.affected > 0;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
    async getWordByName(name) {
        return this.wordRepository.findOne({ where: { name: name } });
    }
    async getAllWords() {
        return this.wordRepository.find();
    }
};
exports.WordService = WordService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(word_1.Word)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WordService);
//# sourceMappingURL=word.service.js.map