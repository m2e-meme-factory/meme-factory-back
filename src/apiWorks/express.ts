import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { getReferalsCount, getUserById, getUserFull, verifyUser } from '../dbWorks/dbWorks';
import { useAnswerWebQuery } from '../tgWorks/webQueryWorks';
import { createTask_verifyUser } from '../taskWorks/taskCreator';
import { error } from 'console';


const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors());
app.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    return next()
  }
  catch (err) {
    return res.status(401).json({
      error: true,
      message: err instanceof Error ? `${err.name} - ${err.message}` : ""
    })
  }
})

app.get("/", (req, res) => res.send("hey"))


app.post("/is_user_verified", async (req, res) => {
  const userId = req.body.userId?.toString()

  if (!userId)
    return res.status(401).json({
      error: true,
      message: "user_id is required"
    });

  const user = await getUserFull(userId)

  return res.json({isUser: user ? user.isVerified : false})
})

app.post("/verify_user", async (req, res) => {
  const queryId = req.query.query_id?.toString()
  const userId = req.body.userId?.toString()

  if (!userId || !queryId || !req.body)
    return res.status(401).json({
      error: true,
      message: "user_id or query_id is required"
    });

  const user = await getUserFull(userId)

  if (user?.isVerified)
    return res.json(user)

  const result = await verifyUser(userId, req.body)

  if (result){
    await createTask_verifyUser(userId)
    await useAnswerWebQuery(
      {
        queryId: queryId,
        title: 'Верификация',
        type: 'verification'
      }
    );
  }
  return res.json(result)
})

app.get("/referals_info",  async (req, res) => {
  
  const ref_id = req.query.ref_id?.toString()

  if (!ref_id)
    return res.status(401).json({
      error: true,
      message: "ref_id is required",
      data: null,
    });

  const refCount = await getReferalsCount(ref_id);

  return res.json({
    error: false,
    data: {
      count: refCount?._count
    }
  })
})



app.get("/get_user_data", async (req, res) => {
  const user_id = req.query.user_id?.toString()

  if (!user_id)
    return res.status(401).json({
      error: true,
      message: "user_id or query_id is required"
    });

  const user = await getUserById(user_id)

  return res.json({
    error: false,
    data: {
      user
    }
  })
})


export const init = async () => {
  try {
    const user = await getUserById("628264197")
    const refs = await getReferalsCount(user?.ref_uuid!)

    // console.log(user, refs)

    app.listen(PORT, async () => {
      console.log(`Server is running on PORT=${PORT}...`);
    });
  } catch (err) {
    console.log(err);
  }
};

