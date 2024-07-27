import * as dbWorks from "./dbWorks/dbWorks"
import * as api from "./apiWorks/express"
import * as bot from "./tgWorks/index"
import * as taskWorks from "./taskWorks"


const init = async () => {
    try{
        await dbWorks.init()
        await api.init()
        await bot.init()
        await taskWorks.init()

        console.log(`✅✅✅ Initialization COMPLETE!`)
    }
    catch (err) {
        console.log(`❌❌❌ Initialization FAILED!`, err)
    }
} 

init()