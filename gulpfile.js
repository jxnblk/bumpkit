// Gulpfile
var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var footer = require('gulp-footer');
var fs = require('fs');
var header = require('gulp-header');
var markdown = require('gulp-markdown');
var minifyCss = require('gulp-minify-css');
var pygmentize = require('pygmentize-bundled');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var uncss = require('gulp-uncss');

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


// Create homepage based on README.md
gulp.task('md', function() {
  var mdoptions = {
    highlight: function (code, lang, callback) {
      pygmentize({ lang: lang, format: 'html' }, code, function(err, result) {
        callback(err, result.toString());
      });
    }
  };
  return gulp.src('README.md')
    .pipe(markdown(mdoptions))
    .pipe(rename('index.html'))
    .pipe(header( fs.readFileSync('./docs/_header.html', 'utf8')))
    .pipe(footer( fs.readFileSync('./docs/_footer.html', 'utf8') ))
    .pipe(gulp.dest('.'));
});

gulp.task('dev', ['compile', 'minify'], function() {
  gulp.watch(['./**/*.html', './**/*.js', '!./node_modules/**/*', '!./dist/**/*'], ['compile', 'minify']);
  connect.server();
});

gulp.task('default', ['compile', 'minify'], function() {
});


gulp.task('watch', function() {
  gulp.watch('src/*', ['compile', 'minify', 'md']);
});

