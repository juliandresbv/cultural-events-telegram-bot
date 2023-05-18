import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ScrapperService } from './scrapper.service';
import { ScrapperController } from './scrapper.controller';
import { ProImagenesColombiaProvider } from './providers/pro-imagenes-colombia/pro-imagenes-colombia.provider';
import { AgendaCulturalBogotaProvider } from './providers/agenda-cultural-bogota/agenda-cultural-bogota.provider';

@Module({
  imports: [HttpModule],
  providers: [
    ScrapperService,
    ProImagenesColombiaProvider,
    AgendaCulturalBogotaProvider,
  ],
  controllers: [ScrapperController],
  exports: [ScrapperService],
})
export class ScrapperModule {}
