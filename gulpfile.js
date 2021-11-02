const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const uglyfly = require('gulp-uglyfly');
const rename = require('gulp-rename');
const concat = require('gulp-concat');

const path = {
    scss: './src/scss/**/*.scss',
    js: './src/js/**/*js',
    img: './src/images/**'
}

/// Scss to css task
function buildStyle() {
    return src(path.scss, { sourcemaps: true })
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(dest('dist/css', { sourcemaps: '.' }));
}

/// Js task 
function buildJs() {
    return src(path.js, { sourcemaps: true })
        .pipe(concat('app.js'))
        .pipe(uglyfly())
        .pipe(dest('dist/js', { sourcemaps: '.' }));
}

/// copy images task
function copyImg() {
    return src(path.img)
        .pipe(dest('dist/images'));
}


/// Watch task
function watchFiles() {
    return watch(
        [path.scss, path.js],
        //  delay for run watch
        // { interval: 1000, usePolling: true },
        series(parallel(buildStyle, buildJs))
    );
}

exports.default = series(parallel(buildStyle, buildJs), copyImg, watchFiles);


