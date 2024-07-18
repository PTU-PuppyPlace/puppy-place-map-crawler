import { Injectable } from '@nestjs/common';
import { NaverRepository } from './naver.repository';
import { TargetRepository } from 'src/target/target.repository';
import { HttpService } from '@nestjs/axios';
import { Target } from '@prisma/client';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { CreateNaverDto } from './dto/naver.dto';
import { NaverBookmarkData } from './interface/naver.interface';
import { Cron } from '@nestjs/schedule';

const NAVER_PLACE_URL: string = 'https://pcmap.place.naver.com/place/';

const BODY_SELECTOR: string = '.place_on_pcmap';

const SCHEDULE_BUTTON_SELECTOR: string =
  '.place_section_content .PIbes .pSavy a';
const SCHEDULE_LIST_SELECTOR: string = '.w9QyJ';

const INFORMATION_BUTTON_SELECTOR: string = '.NSTUp span.TeItc';
const INFORMATION_SELECTOR: string = '.Ve1Rp';

const ETC_SELECTOR: string = '.xPvPE';

const PHONE_SELECTOR: string = '.xlx7Q';

@Injectable()
export class NaverService {
  constructor(
    private readonly naverRepository: NaverRepository,
    private readonly targetRepository: TargetRepository,
    private readonly httpService: HttpService,
  ) {}

  // 매주 월요일 00시에 실행
  @Cron('0 0 * * 1')
  async getNaverMapData(): Promise<void> {
    const browser: puppeteer.Browser = await puppeteer.launch();
    const page: puppeteer.Page = await browser.newPage();

    const saveUrlList: string[] = await this.getSaveUrlList();

    for (const saveUrl of saveUrlList) {
      const naverBookMarkDataList: NaverBookmarkData[] =
        await this.getNaverBookMarkData(saveUrl);

      for (const naverBookMarkData of naverBookMarkDataList) {
        if (!naverBookMarkData.available) {
          continue;
        }
        const dto: CreateNaverDto = new CreateNaverDto();
        dto.schedule = '';
        await page.goto(NAVER_PLACE_URL + naverBookMarkData.sid);
        console.info(
          '[크롤링 시작] 크롤링 작업을 시작합니다. URL : ' + page.url(),
        );
        try {
          try {
            await this.naverRepository.deleteBySid(naverBookMarkData.sid);
          } catch (PrismaClientKnownRequestError) {
            console.log(
              '[크롤링] 삭제할 데이터가 없습니다. sid : ' +
                naverBookMarkData.sid,
            );
          }
          await page.waitForSelector(BODY_SELECTOR, { timeout: 5000 });
          const html: string = await page.content();
          const $ = cheerio.load(html);
          try {
            await page.click(SCHEDULE_BUTTON_SELECTOR);
            $(SCHEDULE_LIST_SELECTOR).each((index, scheduleElement) => {
              if (index === 0) {
                return;
              }
              const timeInformation: string = $(scheduleElement)
                .text()
                .replace('접기', '');
              const serviceTimePairs = timeInformation.match(
                /([가-힣,]+)(\d{2}:\d{2} - \d{2}:\d{2})/g,
              );
              if (serviceTimePairs) {
                serviceTimePairs.forEach((pair) => {
                  const match = pair.match(
                    /([가-힣,]+)(\d{2}:\d{2} - \d{2}:\d{2})/,
                  );
                  if (match) {
                    const service = match[1];
                    const time = match[2];
                    dto.schedule += service + ' ' + time + '\n';
                  }
                });
              } else {
                dto.schedule += timeInformation + '\n';
              }
            });
          } catch (e) {
            console.error(e);
            console.log('[크롤링] 시간 정보가 없습니다. URL : ' + page.url());
          }
          dto.etc = $(ETC_SELECTOR).text();
          dto.phone = $(PHONE_SELECTOR).text();
        } catch (e) {
          console.error(e);
          console.log('[크롤링] 정보가 없습니다. URL : ' + page.url());
        }

        try {
          await page.click(INFORMATION_BUTTON_SELECTOR);
          const html: string = await page.content();

          const $ = cheerio.load(html);
          dto.information = $(INFORMATION_SELECTOR).text();
        } catch (e) {
          console.error(e);
          console.log('[크롤링] 정보가 없습니다. URL : ' + page.url());
          ``;
        }
        dto.address = naverBookMarkData.address;
        dto.category = naverBookMarkData.category;
        dto.latitude = naverBookMarkData.latitude;
        dto.longitude = naverBookMarkData.longitude;
        dto.title = naverBookMarkData.name;
        dto.available = naverBookMarkData.available;
        dto.sid = naverBookMarkData.sid;

        await this.naverRepository.create(dto);
        console.log(
          '[크롤링] 크롤링 작업이 완료되었습니다. URL : ' + page.url(),
        );
      }
    }
    await page.close();
    await browser.close();
  }

  private async getNaverBookMarkData(
    url: string,
  ): Promise<NaverBookmarkData[]> {
    try {
      const response: AxiosResponse = await lastValueFrom(
        this.httpService.get(url),
      );
      return await this.convertToNaverBookmarkData(
        response.data['bookmarkList'],
      );
    } catch (e) {
      console.log(e);
    }
  }

  private async getSaveUrlList(): Promise<string[]> {
    const targets: Target[] =
      await this.targetRepository.findAllByIsActiveTrue();
    return targets.map((target) => target.url);
  }

  private async convertToNaverBookmarkData(
    data: any,
  ): Promise<NaverBookmarkData[]> {
    return data.map((item) => ({
      address: item['address'],
      name: item['name'],
      longitude: item['px'],
      latitude: item['py'],
      sid: item['sid'],
      category: item['mcid'],
      available: item['available'],
    }));
  }
}
