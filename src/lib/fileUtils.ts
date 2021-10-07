// sync version
function walkSync(currentDirPath: any, callback: any) {
    const fs = require('fs'),
        path = require('path');
    fs.readdirSync(currentDirPath).forEach(function (name: any) {
        const filePath = path.join(currentDirPath, name);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}