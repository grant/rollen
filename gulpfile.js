var browserify = require('gulp-browserify');
var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var prefix = require('gulp-autoprefixer');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var minify = require('gulp-minify-css');

var src = {
  js: ['client/js/**/*.js'],
  js_index: ['client/js/main.js'],
  stylus: 'client/stylus/pages/*.styl',
  css: 'public/css/**/*.css'
};

var dest = {
  js: 'public/js',
  css: 'public/css'
};

// Tasks
gulp.task('css', function () {
  gulp.src(src.css)
    .pipe(prefix())
    .pipe(minify())
    .pipe(gulp.dest(dest.css));
});

gulp.task('js', function () {
  gulp.src(src.js_index)
    .pipe(browserify())
    .pipe(gulp.dest(dest.js));
});

gulp.task('watch', function () {
  gulp.watch(src.css, ['css']);
  gulp.watch(src.js, ['js']);
});

gulp.task('default', ['css', 'js', 'watch']);