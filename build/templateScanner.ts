import {scanDir} from "./fileScanner";
import path from "path";
import NunjucksWebpackPlugin from 'nunjucks-webpack-plugin'

new NunjucksWebpackPlugin({
    templates: [
        {
            from: "/path/to/template.njk",
            to: "template.html"
        }
    ]
})

export function scanTemplates() {
    scanDir(path.resolve(__dirname,'../src/ui/templates'),(file)=>{

    })
}