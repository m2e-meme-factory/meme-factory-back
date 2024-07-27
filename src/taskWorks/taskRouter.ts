import { Task, User } from "@prisma/client";
import { ITaskDatas } from "./types";
import { sendNewUserMessages } from "../tgWorks/messaging/messagingWorks";
import { handleRestrictUserTask } from "./taskRoutes/restrictUserRoute";

export const handleTask = async (telegramId: string, task: Task & {user: User}) => {
    const data: ITaskDatas = JSON.parse(task.data)
    const username = task.user.username
    let taskRes = false

    try {
        switch (data.taskName) {
            case "verify":
                taskRes = await sendNewUserMessages(telegramId, username);
                break;

            case "restrict_user":
                taskRes = await handleRestrictUserTask(telegramId, data, username)
                break;

            default:
                break;
        }
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(`ERROR: ${err.name} - ${err.message}`)
        }
    }

    
    return taskRes
}