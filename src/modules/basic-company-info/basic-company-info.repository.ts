import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { BasicCompanyInfo } from '@prisma/client';

@Injectable()
export class BasicCompanyInfoRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: number): Promise<BasicCompanyInfo | null> {
    return this.prismaService.basicCompanyInfo.findUnique({ where: { id } });
  }

  async update(id: number, data): Promise<BasicCompanyInfo> {
    return this.prismaService.basicCompanyInfo.update({ where: { id }, data });
  }
}