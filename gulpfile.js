var gulp = require('gulp');
var concat = require('gulp-concat');
var refresh = require('gulp-livereload');
var webpackStream = require('webpack-stream');
var webpack = require('webpack');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var embedlr = require('gulp-embedlr');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
//var del = require('del');

var dev = (process.env.NODE_ENV || 'development').trim() == 'development';

gulp.task('default', ['build']);

var ts = ['js', 'html', 'css', 'fonts'];
if (!argv.single) ts.push('watch');

gulp.task('build', ts);

gulp.task('js', function() {
    gulp.src(['src/js/main.jsx'])
        .pipe(webpackStream(require('./webpack.config.js'), webpack))
        .pipe(gulp.dest('build/js'))
        .pipe(gulpif(!argv.single, refresh()))
});
gulp.task('css', function() {
    gulp.src(['src/css/*.*css'])
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('bundle.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('build/css'))
        .pipe(gulpif(!argv.single, refresh()))
});
gulp.task('html', function() {
    gulp.src("src/*.html")
        .pipe(gulpif(dev, embedlr({
            port: 35729,
            src: "' +'http://' + (location.hostname || 'localhost') + ':" + 35729 + "/livereload.js?snipver=1"
        })))
        .pipe(gulp.dest('build/'))
        .pipe(gulpif(!argv.single, refresh()))
});
gulp.task('fonts', function() {
    gulp.src("src/fonts/**").pipe(gulp.dest('build/fonts'));
    gulp.src("src/img/**").pipe(gulp.dest('build/img'));
});

gulp.task('watch', function() {
    refresh.listen();
    gulp.watch('src/js/**', ['js']);
    gulp.watch('src/css/**', ['css']);
    gulp.watch('src/*.html', ['html']);
});