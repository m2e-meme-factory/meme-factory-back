import { Markup, Telegraf } from "telegraf";
import { buildQueryMessage } from "./replies/buildQueryMessage";
import { bot } from ".";
import { User } from "@prisma/client";
import { getFormattedDate } from "./utils/getFormattedDate";
import { getTime } from "./utils/getTime";
import { createUndelitableMessage } from "src/dbWorks/dbWorks";

type AnswerType = "order" | 'verification' | 'alert' | "request" | "is_banned"

export type IWebQueryAnswer = {
  queryId: string,
  body?: { from: string, to: string, datetime: Date, passengersCount: number, driver: User, },
  type: AnswerType
  title: string
}

export const useAnswerWebQuery = async (
  {queryId, body, title, type}: IWebQueryAnswer
) => {
  try {
    await bot.telegram.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: title,
      input_message_content: {
        message_text: buildQueryMessage({queryId, body, type, title}),
        parse_mode: 'HTML',
      },
    });
  } catch (err) {
    console.log(err);
  }
};