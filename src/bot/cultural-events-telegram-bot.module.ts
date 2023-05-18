import { Module } from '@nestjs/common';

import { ScrapperModule } from '../scrapper/scrapper.module';
import { CulturalEventsTelegramBotService } from './cultural-events-telegram-bot.service';

@Module({
  imports: [ScrapperModule],
  providers: [CulturalEventsTelegramBotService],
  exports: [CulturalEventsTelegramBotService],
})
export class CulturalEventsTelegramBotModule {}
