import { Controller, Get, Put } from '@nestjs/common';
import { BannerService } from './banners.service';

@Controller('banners')
export class BannersController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  async findOne(): Promise<any> {
    return this.bannerService.findOne();
  }

  @Put('')
  async update(data): Promise<void> {
    await this.bannerService.update(data);
  }
}
