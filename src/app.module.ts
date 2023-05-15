import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapperModule } from './scrapper/scrapper.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { CulturalEventsTelegramBotModule } from './bot/cultural-events-telegram-bot.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
