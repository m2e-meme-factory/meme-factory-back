export type ITaskDatas = IVerifyTaskData |  IRestrictTaskData

interface TaskData {

}

export interface IRestrictTaskData extends TaskData {
    taskName: "restrict_user"
    isBanned: boolean
}

export interface IVerifyTaskData extends TaskData {
    taskName: "verify"
}

export interface IUserRequest {
    from: string;
    to: string;
    datetime: string
}
