import { Telegraf, Markup, session } from 'telegraf';
import 'dotenv/config';

import { UserSessionContext } from './types';
import { createUser, getUserByRefId, getUserFull, getUserUndelitableMessages } from '../dbWorks/dbWorks';
import { mainMenu } from './replies/mainMenu';
import { banUserReply, unbanUserReply } from './replies/userRestrictionMessages';

export const WEB_URL = process.env.WEB_URL!;

const hasUsername = async (ctx: UserSessionContext, next: () => Promise<void>) => {
  if (!ctx.from?.username && ctx.chat?.type == "private") {
    return await ctx.reply(
      'Для использования бота необходимо установить имя пользователя (username) в настройках своего профиля Telegram'
    );
  }

  return await next()
}


const deleteLastMessages = async (ctx: UserSessionContext) => {
  if (!ctx.chat?.id)
    return;
  const undelitableMessages = await getUserUndelitableMessages(ctx.chat.id.toString())

  if (!undelitableMessages) return;

  const undelitableMessageIds = undelitableMessages.map((m) => m.message_id)
  const message_id = ctx.message?.message_id || ctx.callbackQuery?.message?.message_id

  if (message_id && ctx.chat?.type == "private" && !ctx.webAppData?.data) {
    let messageIds = []
    for (let index = 10; index > 0; index--) {
      const messageToDeleteId = (message_id - index).toString()
      if (!undelitableMessageIds.includes(messageToDeleteId))
        messageIds.push(message_id - index)
    }
    try {
      await bot.telegram.deleteMessages(ctx.chat.id, messageIds)
    }
    catch (err) {
      console.log(err)
    }
  }
}

const deleteLastMessagesMiddleware = async (ctx: UserSessionContext, next: () => Promise<void>) => {
  await deleteLastMessages(ctx)

  return await next()
}

export const bot = new Telegraf<UserSessionContext>(process.env.BOT_TOKEN!);
bot.use(session());
bot.use(hasUsername)
bot.use(deleteLastMessagesMiddleware)

bot.start(async (ctx) => {
  if (ctx.chat.type != "private") return;
  if (!ctx.from.username) {
    return await ctx.reply(
      'Для использования бота необходимо установить имя пользователя (username) в настройках своего профиля Telegram'
    );
  }
  const params = ctx.message.text
    .replace('/start ', '')
    .replace('/start', '')
    .replace('ref_', '');

  const tgId = ctx.from.id.toString()
  const user = await getUserFull(tgId)
  console.log(params)



  if (!user) {
    await createUser(tgId, ctx.from.username, params)

    if (params) {
      const referer = await getUserByRefId(params)

      bot.telegram.sendMessage(tgId, "You have a new referal check your profile here ↓ ",  {
        parse_mode: "HTML",
        reply_markup:  Markup.inlineKeyboard([
          Markup.button.webApp(
            'Открыть приложение',
            "https://2813-79-137-207-161.ngrok-free.app" + `/profile`
          ),
          ]).reply_markup
    })
    }
  }



  if (!user?.isVerified) {
    return await ctx.reply(
      'Перед использованием Transfer bot необходимо пройти верификацию:',
      Markup.inlineKeyboard([
        Markup.button.webApp(
          'Открыть приложение',
          "https://2813-79-137-207-161.ngrok-free.app" + `/profile`
        ),
      ])
    );
  }

  if (params[0] == "join" && params[1]) {
    // await joinDriveReply(ctx, +params[1])
  }
  else
    await mainMenu(ctx)
});


bot.action("cancel", deleteLastMessages)

// bot.action(/join_drive_(.+)/, async (ctx) => reqDeliteDriveReply(ctx, ctx.match[1]))

// bot.action(/req_delete_(.+)/, async (ctx) => reqDeliteDriveReply(ctx, ctx.match[1]))
// bot.action(/delete_(.+)/, async (ctx) => deleteDriveReply(ctx, Number(ctx.match[1])))
// bot.command("drives", drivesReply)

// bot.action(/req_exit_(.+)/, async (ctx) => reqExitDriveReply(ctx, ctx.match[1]))
// bot.action(/exit_(.+)/, async (ctx) => exitDriveReply(ctx, Number(ctx.match[1])))
// bot.command("joined", passangerDrivesReply)

// bot.action(/req_remove_(.+)_(.+)/, async (ctx) => reqRemovePassangerReply(ctx, ctx.match[1],  ctx.match[2]))
// bot.action(/remove_(.+)_(.+)/, async (ctx) => removePassangerReply(ctx, Number(ctx.match[1]),  ctx.match[2]))
// bot.action(/passangers_(.+)/, async (ctx) => passagnersReply(ctx, Number(ctx.match[1])))

bot.command("ban", banUserReply)
bot.command("unban", unbanUserReply)

bot.action('ban_driver', async (ctx) => {
  await ctx.reply(`Пользователь заблокирован! Туда его!`);
});

bot.action('unban_driver', async (ctx) => {
  await ctx.reply(
    'Вы пощадили пользователя и дали ему возможность вновь пользоваться ботом!'
  );
});

bot.action('ban_passenger', async (ctx) => {
  await ctx.reply(`Пользователь заблокирован! Туда его!`);
});

bot.action('unban_passenger', async (ctx) => {
  await ctx.reply(
    'Вы пощадили пользователя и дали ему возможность вновь пользоваться ботом!'
  );
});

// -1001965007959

export const init = async () => {
  try {
    // loop();
    bot.launch();
    console.log(`✅ tgWorks`)
  }
  catch (err) {
    console.log(`❌ dbWorks FAILED!`, err)
  }
}