import * as cheerio from 'cheerio';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { normalizeText } from 'normalize-text';

@Injectable()
export class ProImagenesColombiaProvider {
  private readonly baseUrl = process?.env?.PRO_IMAGENES_COLOMBIA_BASE_URL;

  constructor(private readonly httpService: HttpService) {}

  public async getEvents(): Promise<
    {
      title: string;
      description: string;
      date: string;
      link: string;
    }[]
  > {
    const data = await this.getData();

    return this.formatData(data);
  }

  private async getData() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/secciones/eventos/eventos.php?pagina=1&tipo=1`,
        ),
      );

      return response?.data;
    } catch (error) {
      console.log(`[ERROR] error getting data from ${this.baseUrl}`, error);

      throw error;
    }
  }

  private async formatData(data): Promise<
    {
      title: string;
      description: string;
      date: string;
      link: string;
    }[]
  > {
    const document = cheerio.load(data);
    const eventElements = document('div.listCif').children().toArray();

    const eventsToJson = eventElements.map((event) => {
      const title = document(event).find('.gDesc > h3')?.text();
      const description = normalizeText(
        document(event).find('.gDesc > .desc')?.text() ?? '',
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
