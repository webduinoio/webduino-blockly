var gulp = require('gulp');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var htmlmin = require('gulp-htmlmin');
var del = require('del');
var merge = require('merge-stream');
var rename = require("gulp-rename");
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var path = require('path');
var moment = require('moment');
var fileSuffix = moment().format('YYYYMMDDHHmmss');
var ghtmlSrc = require('gulp-html-src');
var dom  = require('gulp-dom')


gulp.task('clean-dist', function () {
  return del(['./dist/*']);
});

gulp.task('copyFiles', ['clean-dist'], function () {
  return gulp.src([
      './**/*',
      '!js{,/**}',
      '!css{,/**}',
      '!dist{,/**}',
      '!node_modules{,/**}',
      '!engine{,*}.html',
      '!gulpfile.js',
      '!package.json',
      '!bower.json'
    ])
    .pipe(gulp.dest('dist/'));
});

gulp.task('page-index-media', ['copyFiles'], function () {
  return gulp.src(['dist/media/**/*', '!dist/media/svg{,/**}'])
    .pipe(imagemin())
    .pipe(gulp.dest('dist/media/'));
});

gulp.task('page-index-less', ['copyFiles'], function () {
  return gulp.src([
      'css/less/*.less',
    ])
    .pipe(concat('temp.less'))
    .pipe(less())
    .pipe(cleanCSS({
      keepBreaks: true
    }))
    .pipe(rename({
      basename: 'index',
      extname: '.css'
    }))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('page-index-css', ['copyFiles', 'page-index-less'], function () {
  return gulp.src([
      'dist/components/bootstrap-select/dist/css/bootstrap-select.min.css',
      'dist/css/index.css'
    ])
    .pipe(concatCss('temp.css'))
    .pipe(cleanCSS({
      keepBreaks: true
    }))
    .pipe(rename({
      basename: 'bundle',
      suffix: '-' + fileSuffix
    }))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('page-index-js', ['copyFiles'], function () {
  return gulp.src('index.html')
    .pipe(ghtmlSrc())
    .pipe(concat('temp.js'))
    .pipe(uglify())
    .pipe(rename({
      basename: 'bundle',
      suffix: '-' + fileSuffix
    }))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('page-index-html', ['copyFiles'], function () {
  return gulp.src('dist/index.html')
    .pipe(dom(function(){
      this.querySelectorAll('body')[0].setAttribute('data-timestamp', fileSuffix);
      return this;
    }))
    .pipe(htmlreplace({
      'css': [
        'components/bootstrap/dist/css/bootstrap.min.css',
        'css/bundle-' + fileSuffix + '.css'
      ],
      'js': 'js/bundle-' + fileSuffix + '.js'
    }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeComments: true
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build-page-index', ['clean-dist', 'copyFiles', 'page-index-media', 'page-index-css', 'page-index-js', 'page-index-html']);

gulp.task('build', ['build-page-index']);

gulp.task('default', ['build']);
