import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ScrapperModule } from './scrapper/scrapper.module';
import { CulturalEventsTelegramBotModule } from './bot/cultural-events-telegram-bot.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRootAsync({
      useFactory: () => ({
        token: process?.env?.TELEGRAM_BOT_TOKEN,
      }),
    }),
    ScrapperModule,
    CulturalEventsTelegramBotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
