import { Module } from '@nestjs/common';
import { CulturalEventsTelegramBotService } from './cultural-events-telegram-bot.service';
import { ScrapperModule } from 'src/scrapper/scrapper.module';

@Module({
  imports: [ScrapperModule],
  providers: [CulturalEventsTelegramBotService],
  exports: [CulturalEventsTelegramBotService],
})
export class CulturalEventsTelegramBotModule {}
