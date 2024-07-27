import { PrismaClient, PrismaPromise } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export const prisma: PrismaClient = new PrismaClient();

const logErrorTransaction = async <T>(t: PrismaPromise<T>) => {
    try {
        return (await prisma.$transaction([t]))[0]
    }
    catch (err) {
        // logErrorWithComment(err, "dbWorks")
    }
}


export const init = async () => {
    try {
        await getUserById("1")
        console.log(`✅ dbWorks!`)
    }
    catch (err) {
        console.log(`❌ dbWorks FAILED!`, err)
    }
}


export const getUserById = async (telegramId: string) => {
    return logErrorTransaction(prisma.user.findFirst({
        where: {
            telegramId
        }
    }))
}

export const getReferalsCount = async (ref_uuid: string) => {
    return logErrorTransaction(prisma.user.aggregate({
        _count: true,
        where: {
            refId: ref_uuid
        },
        
    }))
}


export const findUser = async (query_selector: string) => {
    return logErrorTransaction(prisma.user.findFirst({
        where: {
            OR: [{
                username: query_selector,
            },
            {
                telegramId: query_selector
            }]
        }
    }))
}

export const createUser = async (
    telegramId: string,
    username: string,
    refId?: string
) => {

    return await prisma.user.create({
        data: {
            telegramId,
            username,
            ref_uuid: uuidv4(),
            refId: refId
        }
    })
}

export const getUserByRefId = async (refId: string) => {
    return logErrorTransaction(
        prisma.user.findFirst({
            where: {
                ref_uuid: refId
            }
        })
    )
}

export const verifyUser = async (telegramId: string, data: {
    name: string
    phoneNumber: string
    email: string
}) => {
    return logErrorTransaction(prisma.user.update({
        data: {
            userInfo: {
                create: {
                    name: data.name,
                    email: data.email,
                    phoneNumber: data.phoneNumber
                }
            },
            isVerified: true
        },
        where: {
            telegramId
        }
    }))
}

export const updateUserRestriction = async (telegramId: string, isBaned: boolean) => {
    return logErrorTransaction(
        prisma.user.update({
            where: {
                telegramId
            },
            data: {
                isBaned
            }
        })
    )
}

export const getUserInfo = async (telegramId: string) => {
    return logErrorTransaction(
        prisma.userInfo.findUnique({
            where: {
                userId: telegramId
            }
        })
    )
}

export const getUserFull = async (telegramId: string) => {
    return logErrorTransaction(prisma.user.findUnique({
        where: {
            telegramId,
        },
        select: {
            telegramId: true,
            username: true,
            userInfo: true,
            isBaned: true,
            isVerified: true,
        }
    }))
}

export const addTask = async (telegramId: string, data: string) => {
    return logErrorTransaction(
        prisma.task.create({
            data: {
                userId: telegramId,
                data
            }
        })
    )
}

export const updateTasksAsDone = async (taskIds: number[]) => {
    return logErrorTransaction(
        prisma.task.updateMany({
            where: {
                id: {
                    in: taskIds
                }
            },
            data: {
                done: true
            }
        })
    )
}

export const getTasks = async (take = 3) => {
    return logErrorTransaction(
        prisma.task.findMany({
            where: {
                done: false
            },
            include: {
                user: true
            },
            take
        })
    )
}


export const createUndelitableMessage = async (userId: string, message_id: string) => 
    logErrorTransaction(
    prisma.undelitableMessage.create({
        data: {
            userId,
            message_id
        }
    })
)

export const getUserUndelitableMessages = async (userId: string) => 
    logErrorTransaction(
        prisma.undelitableMessage.findMany({
            where: {
                userId,
            }
        })
)
