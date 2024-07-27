import { sleep } from '../tgWorks/utils/sleep';
import { getTasks, updateTasksAsDone } from '../dbWorks/dbWorks';
import { handleTask } from './taskRouter';


export const init = async () => {
  try {
    loop();
    console.log(`✅ taskLoop`)
  }
  catch (err) {
    console.log(`❌ taskLoop FAILED!`, err)
  }
}
const loop = async () => {
  while (true) {
    try {
      const tasks = await getTasks()

      if (tasks) {
        let doneTaskIds: number[] = []

        for (let i = 0; i < tasks.length; i++) {
          const task = tasks[i];
          
          const res = await handleTask(task.userId, task)
          // if (res)
            doneTaskIds.push(task.id)
        }

        await updateTasksAsDone(doneTaskIds)
      }
    } catch (e) {
      console.log(e);
    }
    await sleep(100);
  }
};
