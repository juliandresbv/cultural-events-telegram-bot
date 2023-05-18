import { Body, Controller, Post } from '@nestjs/common';

import { ScrapperService } from './scrapper.service';
import { CulturalEvent } from './types/scrapper.type';

@Controller('scrapper')
export class ScrapperController {
  constructor(private readonly scrapperService: ScrapperService) {}

  @Post('get-events')
  public async getEvents(
    @Body() body: { eventsQuantity: number },
  ): Promise<CulturalEvent[]> {
    const cinemaEvents = await this.scrapperService.getCinemaEvents(
      body?.eventsQuantity,
    );
    const culturalEvents = await this.scrapperService.getCulturalEvents(
      body?.eventsQuantity,
    );

    return [...cinemaEvents, ...culturalEvents];
  }

  @Post('get-data')
  public async getData(@Body() body: { eventsQuantity: number }): Promise<any> {
    const cinemaData = await this.scrapperService.getCinemaData(
      body?.eventsQuantity,
    );
    const culturalData = await this.scrapperService.getCulturalData(
      body?.eventsQuantity,
    );

    return [...cinemaData, ...culturalData];
  }
}
