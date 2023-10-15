"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordModule = void 0;
const common_1 = require("@nestjs/common");
const word_controller_1 = require("./word.controller");
const word_service_1 = require("./word.service");
const typeorm_1 = require("@nestjs/typeorm");
const word_1 = require("./word");
let WordModule = exports.WordModule = class WordModule {
};
exports.WordModule = WordModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([word_1.Word])
        ],
        controllers: [word_controller_1.WordController],
        providers: [word_service_1.WordService]
    })
], WordModule);
//# sourceMappingURL=word.module.js.map