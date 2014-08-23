// Gulpfile
var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var footer = require('gulp-footer');
var fs = require('fs');
var header = require('gulp-header');
var markdown = require('gulp-markdown');
var marked = require('marked');
var toc = require('marked-toc');
var minifyCss = require('gulp-minify-css');
var pygmentize = require('pygmentize-bundled');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var uncss = require('gulp-uncss');


// Create homepage based on README.md
gulp.task('md', function() {

  var renderer = new marked.Renderer();

  renderer.code = function(code, lang) {
    return code;
  };

  renderer.heading = function (text, level) {
    var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    return '<h' + level + ' id="' + escapedText + '"><a href="#' + escapedText + '">' + text + '</a></h' + level + '>';
  };

  var mdoptions = {
    highlight: function (code, lang, callback) {
      pygmentize({ lang: lang, format: 'html' }, code, function(err, result) {
        callback(err, result.toString());
      });
    },
    renderer: renderer
  };

  return gulp.src('README.md')
    .pipe(markdown(mdoptions))
    .pipe(rename('index.html'))
    .pipe(header( fs.readFileSync('./docs/_header.html', 'utf8')))
    .pipe(footer( fs.readFileSync('./docs/_footer.html', 'utf8') ))
    .pipe(gulp.dest('.'));

});


gulp.task('dev', ['compile', 'minify', 'md'], function() {
  gulp.watch(['./**/*.md', './**/*.html', './**/*.js', '!./node_modules/**/*', '!./dist/**/*'], ['compile', 'minify', 'md']);
  connect.server();
});

gulp.task('default', ['compile', 'minify', 'md'], function() {
});

gulp.task('compile', function() {
  gulp.src('src/bumpkit.js')
    .pipe(browserify({ standalone: 'Bumpkit' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify', function() {
  gulp.src('dist/bumpkit.js')
    .pipe(uglify())
    .pipe(rename('bumpkit.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('uncss', function() {
  gulp.src('docs/css/basscss.min.css')
    .pipe(uncss({ html: ['index.html'] }))
    .pipe(minifyCss())
    .pipe(rename('b.min.css'))
    .pipe(gulp.dest('docs/css'));
});

