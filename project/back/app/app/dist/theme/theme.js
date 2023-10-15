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
var Theme_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme = void 0;
const typeorm_1 = require("typeorm");
let Theme = exports.Theme = Theme_1 = class Theme {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Theme.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Theme.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Theme.prototype, "number_word", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Theme.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Theme_1, (theme) => theme.subthemes),
    __metadata("design:type", Theme)
], Theme.prototype, "parentTheme", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Theme_1, (theme) => theme.parentTheme),
    __metadata("design:type", Array)
], Theme.prototype, "subthemes", void 0);
exports.Theme = Theme = Theme_1 = __decorate([
    (0, typeorm_1.Entity)()
], Theme);
//# sourceMappingURL=theme.js.map