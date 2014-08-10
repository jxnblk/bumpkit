// Gulpfile
var gulp = require('gulp');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

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
  //return gulp.src('src/bumpkit.js')
  //  .pipe(browserify({ standalone: 'Bumpkit' }))
  //  .pipe(uglify())
  //  .pipe(rename('bumpkit.min.js'))
  //  .pipe(gulp.dest('dist'));
});

gulp.task('default', ['compile', 'minify'], function() {
});

gulp.task('watch', function() {
  gulp.watch('src/*', ['compile', 'minify']);
});

