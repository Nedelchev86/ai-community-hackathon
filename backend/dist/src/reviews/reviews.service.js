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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, exchangeId, data) {
        const exchange = await this.prisma.exchange.findUnique({
            where: { id: exchangeId },
            include: { donation: true },
        });
        if (!exchange)
            throw new common_1.NotFoundException('Exchange not found');
        if (exchange.status !== 'completed')
            throw new common_1.BadRequestException('Exchange must be completed to leave a review');
        let revieweeId;
        if (exchange.donation.userId === userId) {
            revieweeId = exchange.requesterId;
        }
        else if (exchange.requesterId === userId) {
            revieweeId = exchange.donation.userId;
        }
        else {
            throw new common_1.ForbiddenException('You are not part of this exchange');
        }
        const existing = await this.prisma.review.findFirst({
            where: { exchangeId, reviewerId: userId },
        });
        if (existing)
            throw new common_1.BadRequestException('You have already reviewed this exchange');
        return this.prisma.review.create({
            data: {
                exchangeId,
                reviewerId: userId,
                revieweeId,
                rating: data.rating,
                comment: data.comment,
                imageUrl: data.imageUrl,
            },
        });
    }
    async getMyReviews(userId) {
        return this.prisma.review.findMany({
            where: { revieweeId: userId },
            include: {
                reviewer: { select: { id: true, name: true } },
                exchange: { include: { donation: { select: { title: true } } } }
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map