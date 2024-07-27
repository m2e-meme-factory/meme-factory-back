import { updateUserRestriction } from "../../dbWorks/dbWorks";
import { IRestrictTaskData } from "../types";
import { sendRestrictUserMessages } from "../../tgWorks/messaging/messagingWorks";

export const handleRestrictUserTask = async (telegramId: string, data: IRestrictTaskData, username: string) => {
    const res = await updateUserRestriction(telegramId, data.isBanned)
    
    if (!res) return false

    await sendRestrictUserMessages(telegramId, data, username)

    if (data.isBanned == false) {
        return true
    } 
    
    return true
}