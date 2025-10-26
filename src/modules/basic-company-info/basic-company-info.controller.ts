import { Controller, Get, Put } from '@nestjs/common';
import { BasicCompanyInfoService } from './basic-company-info.service';

@Controller('basic-company-info')
export class BasicCompanyInfoController {
  constructor(private readonly basicCompanyInfoService: BasicCompanyInfoService) {}

  @Get()
  async findOne(): Promise<any> {
    return this.basicCompanyInfoService.findOne();
  }

  @Put('')
  async update(data): Promise<void> {
    await this.basicCompanyInfoService.update(data);
  }
}