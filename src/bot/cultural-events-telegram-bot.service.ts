import { Context } from 'telegraf';
import { Injectable } from '@nestjs/common';
import { Message } from 'telegraf/typings/core/types/typegram';
import { Command, Ctx, Help, Start, Update } from 'nestjs-telegraf';

import { ScrapperService } from 'src/scrapper/scrapper.service';

enum Category {
  CINE = 'cine',
  CULTURA = 'cultura',
}

@Update()
@Injectable()
export class CulturalEventsTelegramBotService {
  private categories = [Category.CINE, Category.CULTURA];

  constructor(private readonly scrapperService: ScrapperService) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    console.log('start command received');

    const greetingMsg = '¡Hola!, soy el bot de Eventos Culturales.\n\n';
    const goToHelpCommandMsg =
      'Para ver todas mis funciones, escribe el comando /help\n';

    await ctx.reply(greetingMsg + goToHelpCommandMsg);
  }

  @Help()
  async help(@Ctx() ctx: Context) {
    console.log('help command received');

    const headerHelpMsg =
      'A continuación se muestran los comandos disponibles:\n\n';

    const headerStartHelpMsg = '/start\n';
    const bodyStartHelpMsg1 = `Inicia el chat con el chatbot.\n\n`;
    const fullStartHelpMsg = headerStartHelpMsg + bodyStartHelpMsg1;

    const headerHelpHelpMsg = '/help\n';
    const bodyHelpHelpMsg1 = `Brinda ayuda de cómo usar este chatbot.\n\n`;
    const fullHelpHelpMsg = headerHelpHelpMsg + bodyHelpHelpMsg1;

    const headerEventsHelpMsg = '/eventos [cat:categoria] [n:número]\n';
    const bodyEventsHelpMsg1 = `Muestra los eventos de la categoría indicada.\n`;
    const bodyEventsHelpMsg2 = `Parámetros:\n- cat: categoría comprendida en las siguientes categorías (${this.categories.join(
      ', ',
    )}). (opcional).\n- n: número de eventos a mostrar. (opcional).\n`;
    const bodyEventsHelpMsg3 = `Ejemplo:\n/eventos cat:cine n:3\n\n`;

    const fullEventsHelpMsg =
      headerEventsHelpMsg +
      bodyEventsHelpMsg1 +
      bodyEventsHelpMsg2 +
      bodyEventsHelpMsg3;

    await ctx.reply(
      headerHelpMsg + fullStartHelpMsg + fullHelpHelpMsg + fullEventsHelpMsg,
    );
  }

  @Command('eventos')
  async eventos(@Ctx() ctx: Context) {
    console.log('events command received');

    const rawTextMsg = (ctx?.message as Message.TextMessage)?.text;
    const curatedTextMsg = rawTextMsg
      ?.toLowerCase()
      ?.trim()
      ?.replace(/\s\s+/g, ' ');
    console.log(
      '🚀 ~ file: cultural-events-telegram-bot.service.ts:52 ~ CulturalEventsTelegramBotService ~ events ~ curatedTextMsg:',
      curatedTextMsg,
    );

    const params = curatedTextMsg?.split(' ');

    let eventsCategoryParam;
    let eventsQuantityParam = 3;

    params?.forEach((param, index) => {
      if (index === 0) return;

      if (param.includes('cat:')) {
        const category = param.replace('cat:', '');
        if (this.categories.includes(category as Category)) {
          eventsCategoryParam = category;
        }
      }
      if (param.includes('n:')) {
        const quantity = param?.replace('n:', '');
        eventsQuantityParam = Number(quantity) || 3;
      }
    });

    if (!eventsCategoryParam) {
      for (const category of this.categories) {
        await this.sendEventsReply(category, eventsQuantityParam, ctx);
      }
    } else {
      await this.sendEventsReply(eventsCategoryParam, eventsQuantityParam, ctx);
    }
  }

  private async sendEventsReply(
    eventsCategory: Category,
    eventsQuantity: number,
    ctx: Context,
  ) {
    const events = await this.getEventsByCategory(
      eventsCategory,
      eventsQuantity,
    );

    const msgs = events.map((event) => {
      const title = event?.title ? `${event?.title}\n\n` : '';
      const description = event?.description
        ? `* Descripción: ${event.description}\n`
        : '';
      const date = event?.date ? `* Fecha: ${event.date}\n` : '';
      const link = event?.link ? `* Más informacion: ${event.link}` : '';

      return title + description + date + link;
    });

    const eventsCategoryMsg =
      (eventsCategory as string).charAt(0).toUpperCase() +
      (eventsCategory as string).slice(1);

    await ctx.reply(`Estos son los eventos de categoría ${eventsCategoryMsg}:`);

    await Promise.all(msgs.map((msg) => ctx.reply(msg)));
  }

  private async getEventsByCategory(
    eventsCategory: Category,
    eventsQuantity: number,
  ) {
    let events = [];

    if (eventsCategory === Category.CULTURA) {
      events = await this.scrapperService.getCulturalEvents(eventsQuantity);
    } else if (eventsCategory === Category.CINE) {
      events = await this.scrapperService.getCinemaEvents(eventsQuantity);
    }

    return events;
  }
}
