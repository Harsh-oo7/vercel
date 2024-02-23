import fs from 'fs';
import path from 'path';

export const getAllFiles = (folderPath: string) => {

    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);

    allFilesAndFolders.forEach((fileOrFolder) => {
        const fullFilePath = path.join(folderPath, fileOrFolder);
        if(fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath)) // this is a directory
        } else {
            response.push(fullFilePath)
        }
    })

    return response;
}