import dotenv from 'dotenv'
dotenv.config()
import { getRedisConnection } from './redis'
import { copyFinalDist, downloadS3Folder } from './aws'
import { buildProject } from './utils'
let RedisConnection = getRedisConnection()


async function main() {
    let Redis = await RedisConnection
    while(1) {
        const response : any = await Redis.brpop('build-queue', 0)
        console.log("resposne", response)
        const id = response[1]

        await downloadS3Folder(`output/${id}`)
        await buildProject(id)
        await copyFinalDist(id)
        Redis.hset("status", id, "deployed")
    }
}

main()

