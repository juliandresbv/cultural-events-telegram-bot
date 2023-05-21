import {
  normalizeText,
  normalizeWhiteSpaces,
  capitalizeFirstLetter,
} from 'normalize-text';
import * as cheerio from 'cheerio';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { createArrayFromRange } from '../../../scrapper/utils/utils';
import { CulturalEvent } from '../../../scrapper/types/scrapper.type';

@Injectable()
export class ProImagenesColombiaProvider {
  private readonly baseUrl = process?.env?.PRO_IMAGENES_COLOMBIA_BASE_URL;
  private readonly elementsPerPage = 8;

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
      const pages = createArrayFromRange(1, lastPage);

      const eventsData = (
        await Promise.allSettled(
          pages.map((page) =>
            firstValueFrom(
              this.httpService.get(
                `${this.baseUrl}/secciones/eventos/eventos.php?tipo=1&pagina=${page}`,
              ),
            ),
          ),
        )
      )?.map((event) => {
        if (event?.status == 'rejected') {
          throw event?.reason;
        }

        return (event as PromiseFulfilledResult<any>)?.value?.data;
      });

      return eventsData;
    } catch (error) {
      console.log(`[ERROR] error getting data from ${this.baseUrl}`, error);

      // throw error;
    }
  }

  public formatData(data: string): CulturalEvent[] {
    const document = cheerio.load(data);
    const eventElements = document('div.listCif').children().toArray();

    const eventsToJson = eventElements.map((event) => {
      const title = document(event).find('.gDesc > h3')?.text();
      const rawDescription = document(event).find('.gDesc > .desc')?.text();
      const description = capitalizeFirstLetter(
        normalizeWhiteSpaces(normalizeText(rawDescription)),
      );
      const date = document(event).find('.gDesc > h4')?.text();
      const link = `${this.baseUrl}${document(event)
        .find('.gDesc > a')
        ?.attr('href')}`;

      return {
        title,
        description,
        date,
        link,
      };
    });

    return eventsToJson;
  }
}
