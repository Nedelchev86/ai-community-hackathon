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
exports.DonationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DonationsService = class DonationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        return this.prisma.donation.create({
            data: {
                type: data.type || 'donation',
                title: data.title,
                description: data.description,
                category: data.category,
                imageUrl: data.imageUrl,
                city: data.city,
                lat: data.lat,
                lng: data.lng,
                userId: userId,
            },
        });
    }
    async findAll() {
        return this.prisma.donation.findMany({
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByUser(userId) {
        return this.prisma.donation.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async update(id, userId, data) {
        const donation = await this.prisma.donation.findFirst({
            where: { id, userId },
        });
        if (!donation)
            throw new Error('Donation not found or unauthorized');
        return this.prisma.donation.update({
            where: { id },
            data: {
                type: data.type,
                title: data.title,
                description: data.description,
                category: data.category,
                imageUrl: data.imageUrl,
                city: data.city,
                lat: data.lat,
                lng: data.lng,
                status: data.status,
            },
        });
    }
    async remove(id, userId) {
        const donation = await this.prisma.donation.findFirst({
            where: { id, userId },
        });
        if (!donation)
            throw new Error('Donation not found or unauthorized');
        return this.prisma.donation.delete({
            where: { id },
        });
    }
};
exports.DonationsService = DonationsService;
exports.DonationsService = DonationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DonationsService);
//# sourceMappingURL=donations.service.js.map