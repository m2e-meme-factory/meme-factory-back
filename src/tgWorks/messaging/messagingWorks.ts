import { IRestrictTaskData } from "../../taskWorks/types";
import { bot } from "..";
import { getUserInfo } from "../../dbWorks/dbWorks";
import { getFormattedDate } from "../utils/getFormattedDate";
import { getTime } from "../utils/getTime";
import { Markup } from "telegraf";


export const ADMIN_CHAT_ID = "-1002035682932"
export const PUBLIC_CHAT_ID = "-1002138859364"

export const sendNewUserMessages = async (telegramId: string, username: string) => {
    const verifiedUser = await getUserInfo(telegramId)

    if (!verifiedUser)
        return false

    await bot.telegram.sendMessage(ADMIN_CHAT_ID, `Новая верификация: <a href="https://t.me/${username}">${username}</a> \n\nИмя: ${verifiedUser.name} \nТелефон ${verifiedUser.phoneNumber} \nemail: ${verifiedUser.email}`, {
        parse_mode: "HTML"
    })    

    return true
}


export const sendRestrictUserMessages = async (telegramId: string, data: IRestrictTaskData, username: string) => {
    await bot.telegram.sendMessage(ADMIN_CHAT_ID, `Статус аккаунта пользователя @${username}: <code>${data.isBanned ? "не рабочий" : "рабочий"}</code>`, {
        parse_mode: "HTML"
    })
    
    await bot.telegram.sendMessage(telegramId, data.isBanned ? `Ваш аккаунт был заблокирован, вы больше не можете взаимодействовать с ботом` : `Администрация сервиса вернула вам право на взаимодействие с сервисом`, {
        parse_mode: "HTML"
    })    
}