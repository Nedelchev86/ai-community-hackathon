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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExchangesService = class ExchangesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, donationId) {
        const donation = await this.prisma.donation.findUnique({
            where: { id: donationId },
        });
        if (!donation)
            throw new common_1.NotFoundException('Donation not found');
        if (donation.userId === userId)
            throw new common_1.ForbiddenException('Cannot request your own donation');
        if (donation.status !== 'available')
            throw new common_1.ForbiddenException('Donation is not available');
        return this.prisma.exchange.create({
            data: {
                donationId,
                requesterId: userId,
                status: 'pending',
            },
        });
    }
    async getMyRequests(userId) {
        return this.prisma.exchange.findMany({
            where: { requesterId: userId },
            include: {
                donation: {
                    include: { user: { select: { id: true, name: true, email: true } } }
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getMyReceivedRequests(userId) {
        return this.prisma.exchange.findMany({
            where: {
                donation: { userId },
            },
            include: {
                requester: { select: { id: true, name: true, email: true } },
                donation: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async acceptRequest(userId, exchangeId) {
        const exchange = await this.prisma.exchange.findUnique({
            where: { id: exchangeId },
            include: { donation: true },
        });
        if (!exchange)
            throw new common_1.NotFoundException('Exchange not found');
        if (exchange.donation.userId !== userId)
            throw new common_1.ForbiddenException('Not authorized');
        await this.prisma.exchange.update({
            where: { id: exchangeId },
            data: { status: 'accepted' },
        });
        return this.prisma.donation.update({
            where: { id: exchange.donationId },
            data: { status: 'reserved' },
        });
    }
    async completeRequest(userId, exchangeId) {
        const exchange = await this.prisma.exchange.findUnique({
            where: { id: exchangeId },
            include: { donation: true },
        });
        if (!exchange)
            throw new common_1.NotFoundException('Exchange not found');
        if (exchange.donation.userId !== userId && exchange.requesterId !== userId) {
            throw new common_1.ForbiddenException('Not authorized');
        }
        if (exchange.status !== 'accepted' && exchange.status !== 'completed') {
            throw new common_1.ForbiddenException('Exchange must be accepted first');
        }
        const isOwner = exchange.donation.userId === userId;
        const isRequester = exchange.requesterId === userId;
        const updatedData = {};
        if (isOwner)
            updatedData.ownerCompleted = true;
        if (isRequester)
            updatedData.requesterCompleted = true;
        const willBeCompleted = (isOwner ? true : exchange.ownerCompleted) &&
            (isRequester ? true : exchange.requesterCompleted);
        if (willBeCompleted) {
            updatedData.status = 'completed';
            await this.prisma.donation.update({
                where: { id: exchange.donationId },
                data: { status: 'completed' },
            });
        }
        return this.prisma.exchange.update({
            where: { id: exchangeId },
            data: updatedData,
        });
    }
};
exports.ExchangesService = ExchangesService;
exports.ExchangesService = ExchangesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExchangesService);
//# sourceMappingURL=exchanges.service.js.map