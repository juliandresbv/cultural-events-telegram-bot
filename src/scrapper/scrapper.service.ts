import { Injectable } from '@nestjs/common';
import { ProImagenesColombiaProvider } from './providers/pro-imagenes-colombia/pro-imagenes-colombia.provider';

@Injectable()
export class ScrapperService {
  constructor(
    private readonly proImagenesColombiaProvider: ProImagenesColombiaProvider,
  ) {}

  async getEvents() {
    return this.proImagenesColombiaProvider.getEvents();
  }
}
