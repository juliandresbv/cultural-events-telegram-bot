import { Injectable } from '@nestjs/common';

import { CulturalEvent } from './types/scrapper.type';
import { ProImagenesColombiaProvider } from './providers/pro-imagenes-colombia/pro-imagenes-colombia.provider';
import { AgendaCulturalBogotaProvider } from './providers/agenda-cultural-bogota/agenda-cultural-bogota.provider';

@Injectable()
export class ScrapperService {
  constructor(
    private readonly proImagenesColombiaProvider: ProImagenesColombiaProvider,
    private readonly agendaCulturalBogotaProvider: AgendaCulturalBogotaProvider,
  ) {}

  async getCulturalEvents(eventsQuantity?: number): Promise<CulturalEvent[]> {
    return this.agendaCulturalBogotaProvider.getEvents(eventsQuantity);
  }

  async getCinemaEvents(eventsQuantity?: number): Promise<CulturalEvent[]> {
    return this.proImagenesColombiaProvider.getEvents(eventsQuantity);
  }

  async getCinemaData(eventsQuantity?: number): Promise<string[]> {
    return this.proImagenesColombiaProvider.getData(eventsQuantity);
  }

  async getCulturalData(eventsQuantity?: number): Promise<string[]> {
    return this.agendaCulturalBogotaProvider.getData(eventsQuantity);
  }
}
