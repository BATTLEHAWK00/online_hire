const env = process.env.NODE_ENV;
const gulp = require('gulp')
const nunjucks = require('gulp-nunjucks')
const nunjucksRender = require('gulp-nunjucks-render')
const {filters} = require('../src/lib/nunjucks_filter')
const inject = require('gulp-inject')

const src = '../src'
const dist = '../dist'

function manageEnv(env: any) {
    filters.forEach((filter: any) => env.addFilter(filter.name, filter.filterFunc, filter.async))
}


// function test() {
//     return gulp.src([src + '/ui/templates/*.njk'])
//         .pipe(nunjucksRender({
//             path: [src + '/ui/templates'], // String or Array
//             data: {
//                 test: 'test'
//             },
//             manageEnv
//         }))
//         .pipe(gulp.dest(dist))
// }

function test() {
    const resources = gulp.src([src+ '/ui/public/**/*.js', '/ui/public/**/*.css'], {read: false})
    return gulp.src([src + '/ui/templates/*.njk'])
        .pipe(nunjucksRender({
            path: [src + '/ui/templates'], // String or Array
            data: {
                test: 'test'
            },
            manageEnv
        }))
        .pipe(inject(resources))
        .pipe(gulp.dest(dist))
}

exports.default = test