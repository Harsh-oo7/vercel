import { S3 } from "aws-sdk"
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const s3 = new S3({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    endpoint: process.env.endpoint
})

// fileName: output/12313/src/app.jsx
// localFilePath: /Users/harsh/vercel/dist/output/12313/src/app.jsx

export const uploadFile = async (fileName: string, localFilePath: string) => {


    const fileContent = fs.readFileSync(localFilePath)
    const response = await s3.upload({
        Body: fileContent,
        Bucket: 'vercel',
        Key: fileName
    }).promise()

    // console.log("response", response)
}