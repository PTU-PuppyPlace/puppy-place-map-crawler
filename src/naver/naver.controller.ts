import { Controller, Get } from '@nestjs/common';
import { NaverService } from './naver.service';

@Controller('naver-map')
export class NaverController {
  constructor(private readonly naverMapService: NaverService) {}

  @Get('bookmarks')
  async getBookmarks() {
    return this.naverMapService.getNaverMapData();
  }
}