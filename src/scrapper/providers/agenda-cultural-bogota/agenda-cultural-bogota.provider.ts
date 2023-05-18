import * as cheerio from 'cheerio';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { createArrayFromRange } from '../../../scrapper/utils/utils';
import { CulturalEvent } from '../../../scrapper/types/scrapper.type';

@Injectable()
export class AgendaCulturalBogotaProvider {
  private readonly baseUrl = process?.env?.AGENDA_CULTURAL_BOGOTA_BASE_URL;
  private readonly elementsPerPage = 6;

  constructor(private readonly httpService: HttpService) {}

  public async getEvents(eventsQuantity?: number): Promise<CulturalEvent[]> {
    const data = await this.getData(eventsQuantity);
    const eventsArr = data?.map((dataItem) => this.formatData(dataItem));
    const events = eventsArr?.flat()?.slice(0, eventsQuantity);

    return events;
  }

  public async getData(eventsQuantity?: number): Promise<string[]> {
    try {
      const lastPage = Math.ceil(eventsQuantity / this.elementsPerPage);
      const pages = createArrayFromRange(0, lastPage - 1);

      const eventsData = (
        await Promise.allSettled(
          pages.map((page) =>
            firstValueFrom(
              this.httpService.get(
                `${this.baseUrl}/que-hacer/agenda-cultural?page=${page}`,
                { timeout: 5000 },
              ),
            ),
          ),
        )
      )
        ?.filter((event) => event?.status === 'fulfilled')
        ?.map(
          (event) => (event as PromiseFulfilledResult<any>)?.value?.data,
        ) as string[];

      return eventsData;
    } catch (error) {
      console.log(`[ERROR] error getting data from ${this.baseUrl}`, error);

      throw error;
    }
  }

  public formatData(data: string): CulturalEvent[] {
    const document = cheerio.load(data);
    const eventElements = document(
      '#main > div > div.region.region-content > div.vista_agenda-cultural-eventos > div.after-banner > div > div > div:nth-child(3) > div > div.view-content',
    )
      .children()
      .toArray();

    const eventsToJson = eventElements.map((event, index) => {
      const title = document(event)
        .find(
          `div:nth-child(${
            index + 1
          }) > div > div > div > div:nth-child(2) > div > div:nth-child(1) > h2 > a`,
        )
        ?.text();
      const date = [1, 2, 3, 4].reduce((acc, curr) => {
        const partialDate = document(event)
          .find(
            `div:nth-child(${
              index + 1
            }) > div > div > div > div:nth-child(2) > div > div:nth-child(3) > div > div.col-xs-4.right-separator > p > span:nth-child(${curr})`,
          )
          ?.text();

        return `${acc} ${partialDate}`?.trim();
      }, '');
      const link = `${this.baseUrl}${document(event)
        .find(
          `div:nth-child(${
            index + 1
          }) > div > div > div > div:nth-child(2) > div > div:nth-child(1) > h2 > a`,
        )
        ?.attr('href')}`;

      return {
        title,
        description: null,
        date,
        link,
      };
    });

    return eventsToJson;
  }
}
