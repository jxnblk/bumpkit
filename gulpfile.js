// Gulpfile
var gulp = require('gulp');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var uncss = require('gulp-uncss');
var minifyCss = require('gulp-minify-css');

gulp.task('compile', function() {
  return gulp.src('src/bumpkit.js')
    .pipe(browserify({ standalone: 'Bumpkit' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify', function() {
  return gulp.src('dist/bumpkit.js')
    .pipe(uglify())
    .pipe(rename('bumpkit.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('uncss', function() {
  return gulp.src('docs/css/basscss.min.css')
    .pipe(uncss({ html: ['index.html'] }))
    .pipe(minifyCss())
    .pipe(rename('b.min.css'))
    .pipe(gulp.dest('docs/css'));
});

gulp.task('default', ['compile', 'minify'], function() {
});

gulp.task('watch', function() {
  gulp.watch('src/*', ['compile', 'minify']);
});

