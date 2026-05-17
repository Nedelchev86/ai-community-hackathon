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
exports.ExchangesController = void 0;
const common_1 = require("@nestjs/common");
const exchanges_service_1 = require("./exchanges.service");
const passport_1 = require("@nestjs/passport");
let ExchangesController = class ExchangesController {
    exchangesService;
    constructor(exchangesService) {
        this.exchangesService = exchangesService;
    }
    async createRequest(req, donationId) {
        return this.exchangesService.create(req.user.userId, donationId);
    }
    async getMyRequests(req) {
        return this.exchangesService.getMyRequests(req.user.userId);
    }
    async getReceivedRequests(req) {
        return this.exchangesService.getMyReceivedRequests(req.user.userId);
    }
    async acceptRequest(req, id) {
        return this.exchangesService.acceptRequest(req.user.userId, parseInt(id));
    }
    async completeRequest(req, id) {
        return this.exchangesService.completeRequest(req.user.userId, parseInt(id));
    }
};
exports.ExchangesController = ExchangesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('donationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ExchangesController.prototype, "createRequest", null);
__decorate([
    (0, common_1.Get)('my-requests'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExchangesController.prototype, "getMyRequests", null);
__decorate([
    (0, common_1.Get)('received-requests'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExchangesController.prototype, "getReceivedRequests", null);
__decorate([
    (0, common_1.Patch)(':id/accept'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ExchangesController.prototype, "acceptRequest", null);
__decorate([
    (0, common_1.Patch)(':id/complete'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ExchangesController.prototype, "completeRequest", null);
exports.ExchangesController = ExchangesController = __decorate([
    (0, common_1.Controller)('exchanges'),
    __metadata("design:paramtypes", [exchanges_service_1.ExchangesService])
], ExchangesController);
//# sourceMappingURL=exchanges.controller.js.map