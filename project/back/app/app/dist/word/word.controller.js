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
exports.WordController = void 0;
const common_1 = require("@nestjs/common");
const word_service_1 = require("./word.service");
const word_1 = require("./word");
const common_2 = require("@nestjs/common");
let WordController = exports.WordController = class WordController {
    constructor(wordService) {
        this.wordService = wordService;
    }
    async getRandomWord() {
        const word = await this.wordService.getRandomWord();
        if (!word) {
            throw new common_2.NotFoundException('No random word found.');
        }
        return word;
    }
    async note_word(note, id) {
        const word = await this.wordService.note_word(note, id);
        if (!word) {
            throw new common_2.NotFoundException('No random word found.');
        }
        return word;
    }
    async updateWord(id, wordData) {
        const updatedWord = await this.wordService.updateWord(id, wordData);
        if (!updatedWord) {
            throw new common_2.NotFoundException('Word not found.');
        }
        return updatedWord;
    }
    async deleteWord(id) {
        const result = await this.wordService.deleteWord(id);
        if (!result) {
            throw new common_2.NotFoundException('Word not found.');
        }
        return { message: 'Word deleted successfully' };
    }
    async getWordByName(name) {
        const word = await this.wordService.getWordByName(name);
        if (!word) {
            throw new common_2.NotFoundException('Word not found.');
        }
        return word;
    }
    async getAllWords() {
        const words = await this.wordService.getAllWords();
        return words;
    }
};
__decorate([
    (0, common_2.Get)('random'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WordController.prototype, "getRandomWord", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, common_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, Number]),
    __metadata("design:returntype", Promise)
], WordController.prototype, "note_word", null);
__decorate([
    (0, common_2.Patch)(':id'),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, word_1.Word]),
    __metadata("design:returntype", Promise)
], WordController.prototype, "updateWord", null);
__decorate([
    (0, common_2.Delete)(':id'),
    __param(0, (0, common_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WordController.prototype, "deleteWord", null);
__decorate([
    (0, common_2.Get)('/word'),
    __param(0, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WordController.prototype, "getWordByName", null);
__decorate([
    (0, common_2.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WordController.prototype, "getAllWords", null);
exports.WordController = WordController = __decorate([
    (0, common_1.Controller)('word'),
    __metadata("design:paramtypes", [word_service_1.WordService])
], WordController);
//# sourceMappingURL=word.controller.js.map