import { Module } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';
import { HttpModule } from '@nestjs/axios';
import { ScrapperController } from './scrapper.controller';
import { ProImagenesColombiaProvider } from './providers/pro-imagenes-colombia/pro-imagenes-colombia.provider';

@Module({
  imports: [HttpModule],
  providers: [ScrapperService, ProImagenesColombiaProvider],
  controllers: [ScrapperController],
  exports: [ScrapperService],
})
export class ScrapperModule {}
