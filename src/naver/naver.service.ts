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

let NAVER_PLACE_URL: string = "https://pcmap.place.naver.com/place/";

let BODY_SELECTOR: string = '.place_on_pcmap'

let SCHEDULE_BUTTON_SELECTOR: string = '.place_section_content .PIbes .pSavy a';
let SCHEDULE_LIST_SELECTOR: string = '.w9QyJ';

let INFOMATION_BUTTON_SELECTOR: string = '.NSTUp span.TeItc';
let INFOMATION_SELECTOR: string = '.Ve1Rp';

let ETC_SELECTOR: string = '.xPvPE';

let PHONE_SELECTOR: string = '.xlx7Q';

@Injectable()
export class NaverService {
    constructor(private readonly naverRepository: NaverRepository, 
        private readonly targetRepository: TargetRepository,
        private readonly httpService: HttpService) {}
    
    async getNaverMapData(): Promise<void>{
        const browser: puppeteer.Browser = await puppeteer.launch();
        const page: puppeteer.Page = await browser.newPage();

        const saveUrlList: string[] = await this.getSaveUrlList();

        for (const saveUrl of saveUrlList) {
            const naverBookMarkDataList: NaverBookmarkData[] = await this.getNaverBookMarkData(saveUrl);

            for (const naverBookMarkData of naverBookMarkDataList) {
                if (!naverBookMarkData.available) {
                    continue;
                }
                const dto: CreateNaverDto = new CreateNaverDto();
                dto.schedule = '';  
                await page.goto(NAVER_PLACE_URL + naverBookMarkData.sid);
                console.info("[크롤링 시작] 크롤링 작업을 시작합니다. URL : " + page.url());
                try {
                    await this.naverRepository.deleteBySid(naverBookMarkData.sid);
                    await page.waitForSelector(BODY_SELECTOR, {timeout: 5000});
                    await page.click(SCHEDULE_BUTTON_SELECTOR);
                    
                    const html: string = await page.content();
                    const $ = cheerio.load(html);
                    $(SCHEDULE_LIST_SELECTOR).each((index, scheduleElement) => {
                        if (index === 0) {
                            return;
                        }
                        const timeInformation: string = $(scheduleElement).text().replace('접기', '');
                        const serviceTimePairs = timeInformation.match(/([가-힣,]+)(\d{2}:\d{2} - \d{2}:\d{2})/g);
                        if (serviceTimePairs) {
                            serviceTimePairs.forEach(pair => {
                                const match = pair.match(/([가-힣,]+)(\d{2}:\d{2} - \d{2}:\d{2})/);
                                if (match) {
                                    const service = match[1];
                                    const time = match[2];
                                    dto.schedule += service + " " + time + '\n';
                                }
                            });
                        } else {
                            dto.schedule += timeInformation + '\n';
                        }
                    });
                    dto.etc = $(ETC_SELECTOR).text();
                    dto.phone = $(PHONE_SELECTOR).text();
                } catch (e) {
                    console.log('[크롤링] 정보가 없습니다. URL : ' + page.url());
                }

                try {
                    await page.click(INFOMATION_BUTTON_SELECTOR);
                    const html: string = await page.content();
    
                    const $ = cheerio.load(html);
                    dto.information = $(INFOMATION_SELECTOR).text();
                } catch (e) {
                    console.log('[크롤링] 정보가 없습니다. URL : ' + page.url());``
                }
                dto.address = naverBookMarkData.address;
                dto.category = naverBookMarkData.category;
                dto.latitude = naverBookMarkData.latitude;
                dto.longitude = naverBookMarkData.longitude;
                dto.title = naverBookMarkData.name;
                dto.sid = naverBookMarkData.sid;

                await this.naverRepository.create(dto);
                console.log('[크롤링] 크롤링 작업이 완료되었습니다. URL : ' + page.url());
            }
        }
        await page.close();
    }
    
    
    private async getNaverBookMarkData(url: string): Promise<NaverBookmarkData[]> {
        try {
            const response: AxiosResponse = await lastValueFrom(this.httpService.get(url));
            return await this.convertToNaverBookmarkData(response.data['bookmarkList']);
        } catch(e) {
            console.log(e);
        }
    }

    private async getSaveUrlList(): Promise<string[]>  {
        const targets: Target[]  = await this.targetRepository.findAllByIsActiveTrue();
        return targets.map(target => target.url);;
    }

    private async convertToNaverBookmarkData(data: any): Promise<NaverBookmarkData[]> {
        return data.map(item => ({
            address: item['address'],
            name: item['name'],
            longitude: item['px'],
            latitude: item['py'],
            sid: item['sid'],
            category: item['mcid'],
            available: item['available'],
        }))
    }
}
