import fs from 'fs'
import path from "path";


export function scanDir(dirPath: string, callback: (file: string) => any) {
    const files: string[] = fs.readdirSync(path.resolve(dirPath))
    files.forEach((f) => {
        const fileName: string = path.join(dirPath, f)
        if (fs.statSync(fileName).isFile())
            callback(fileName)
        else
            scanDir(fileName, callback)
    })
}