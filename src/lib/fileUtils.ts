// import fs from 'fs';
// import path from 'path';
// sync version
// eslint-disable-next-line no-unused-vars
// function walkSync(currentDirPath: string | Buffer | URL, callback: any) {
//   fs.readdirSync(currentDirPath).forEach((name) => {
//     const filePath = path.join(currentDirPath, name);
//     const stat = fs.statSync(filePath);
//     if (stat.isFile()) {
//       callback(filePath, stat);
//     } else if (stat.isDirectory()) {
//       walkSync(filePath, callback);
//     }
//   });
// }
