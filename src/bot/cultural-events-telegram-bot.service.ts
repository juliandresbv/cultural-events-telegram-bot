import { Context } from 'telegraf';
import { Injectable } from '@nestjs/common';
import { Command, Ctx, Start, Update } from 'nestjs-telegraf';
import { ScrapperService } from 'src/scrapper/scrapper.service';

@Update()
@Injectable()
export class CulturalEventsTelegramBotService {
  constructor(private readonly scrapperService: ScrapperService) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    console.log('events command received');

    await ctx.reply('Bienvenido al bot de Eventos Culturales');
  }

  @Command('eventos')
  async events(@Ctx() ctx: Context) {
    console.log('events command received');

    const events = await this.scrapperService.getEvents();

    await ctx.reply('Estos son los eventos culturales');
    await Promise.all(
      events.map((event) =>
        ctx.reply(
          `${event.title}\n\n` +
            `* Descripción: ${event.description}\n` +
            `* Fecha: ${event.date}\n` +
            `* Más informacion: ${event.link}`,
        ),
      ),
    );
  }
}
