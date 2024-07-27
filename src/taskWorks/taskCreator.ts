import { addTask } from "../dbWorks/dbWorks"
import { ITaskDatas, IUserRequest } from "./types"

export const createTask = async (telegramId: string, data: ITaskDatas) => {
    const stringData = JSON.stringify(data)
    return await addTask(telegramId, stringData)
}


export const createTask_restrictUser = async (telegramId: string, isBanned: boolean) => {
    return await createTask(telegramId, {
        taskName: "restrict_user", 
        isBanned
    })
}

export const createTask_verifyUser = async (telegramId: string) => {
    return await createTask(telegramId, {
        taskName: "verify", 
    })
}