import fs from 'fs'
import path from "path";


// eslint-disable-next-line import/prefer-default-export,no-unused-vars
export function scanDir(dirPath: string, callback: (file: string) => never) {
    const files: string[] = fs.readdirSync(path.resolve(dirPath))
    files.forEach((f) => {
        const fileName: string = path.join(dirPath, f)
        if (fs.statSync(fileName).isFile())
            callback(fileName)
        else
            scanDir(fileName, callback)
    })
}