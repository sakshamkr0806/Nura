import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePeriodLogDto, UpdatePeriodLogDto } from '../dto/period-log.dto';

@Injectable()
export class CyclePeriodService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreatePeriodLogDto) {
    return this.prisma.periodLog.create({
      data: {
        ...dto,
        userId,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.periodLog.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
  }

  async update(id: string, userId: string, dto: UpdatePeriodLogDto) {
    return this.prisma.periodLog.update({
      where: { id, userId },
      data: {
        ...dto,
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
      },
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.periodLog.delete({
      where: { id, userId },
    });
  }
}
