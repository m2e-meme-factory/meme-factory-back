import { Context } from "telegraf";
import { ADMIN_CHAT_ID } from "../messaging/messagingWorks";
import { UserSessionContext } from "../types"
import { Message, Update } from "telegraf/typings/core/types/typegram";
import { findUser } from "../../dbWorks/dbWorks";
import { createTask_restrictUser } from "../../taskWorks/taskCreator";

export const banUserReply = async (ctx: Context<{
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
}>) => {
    if (ctx.chat?.id.toString() != ADMIN_CHAT_ID)
        return;
    

    const match = ctx.message.text.split(" ")

    if (match.length <= 1)
        return ctx.reply("Не указан username или ID пользователя")

    const query = match[1];
    const user = await findUser(query)

    if (!user)
        return ctx.reply("Пользователь не найден")

    await createTask_restrictUser(user.telegramId, true)
    return ctx.reply("Создан запрос на блокировку пользователя")
}


export const unbanUserReply = async (ctx: Context<{
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
}>) => {
    if (ctx.chat?.id.toString() != ADMIN_CHAT_ID)
        return;
    

    const match = ctx.message.text.split(" ")

    if (match.length <= 1)
        return ctx.reply("Не указан username или ID пользователя")

    const query = match[1];
    const user = await findUser(query)

    if (!user)
        return ctx.reply("Пользователь не найден")

    await createTask_restrictUser(user.telegramId, false)
    return ctx.reply("Создан запрос на разблокировку пользователя")
}

