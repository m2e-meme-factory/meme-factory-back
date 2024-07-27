import { Markup } from "telegraf";
import { UserSessionContext } from "../types";
import { WEB_URL } from "..";

export const mainMenu = async (ctx: UserSessionContext) => {
    return await ctx.reply(
        'Добро пожаловать в Transfer bot!',
        Markup.inlineKeyboard([
          Markup.button.webApp(
            'Найти водителя',
            WEB_URL + `/search_drive/`
          ),
          Markup.button.webApp(
            'Найти попутчика',
            WEB_URL + `/create_drive/`
          ),
        ])
      );
}