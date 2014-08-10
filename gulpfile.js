// Gulpfile
var gulp = require('gulp');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var uncss = require('gulp-uncss');
var minifyCss = require('gulp-minify-css');
var markdown = require('gulp-markdown');
var pygmentize = require('pygmentize-bundled');
var header = require('gulp-header');
var footer = require('gulp-footer');
var fs = require('fs');

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


gulp.task('default', ['compile', 'minify'], function() {
});


gulp.task('watch', function() {
  gulp.watch('src/*', ['compile', 'minify', 'md']);
});

