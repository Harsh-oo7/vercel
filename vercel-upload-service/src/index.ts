import express from 'express';
import cors from "cors";
import simpleGit from 'simple-git';
import { generate } from './utils';
import path from 'path';
import { getAllFiles } from './file';
import dotenv from 'dotenv'
import { uploadFile } from './aws';
dotenv.config()
import { getRedisConnection } from './redis'
let RedisConnection = getRedisConnection()

const app = express();
app.use(cors());
app.use(express.json());


app.post('/deploy', async (req, res) => {
    const repoURL = req.body.repoUrl;
    console.log(repoURL);
    const id = generate()
    
    await simpleGit().clone(repoURL, path.join(__dirname, `output/${id}`))

    const files = getAllFiles(path.join(__dirname, `output/${id}`))

    files.forEach(async file => {
      await uploadFile(file.slice(__dirname.length + 1), file);
    });
    // console.log(files)

    await new Promise((resolve) => setTimeout(resolve, 5000)); // wait for some time to upload all the files then push to queue otheriwse files are not visible 
    (await RedisConnection).lpush("build-queue", id);
    (await RedisConnection).hset("status", id, "uploaded");
    res.json({id: id})
})

app.get("/status", async (req, res) => {
  const id = req.query.id;
  const response = await (await RedisConnection).hget("status", id as string);
  res.json({
      status: response
  })
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})
