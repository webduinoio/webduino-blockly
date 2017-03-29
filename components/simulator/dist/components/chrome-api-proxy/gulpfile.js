var gulp = require('gulp'),
  zip = require('gulp-zip'),
  merge = require('gulp-merge'),
  shell = require('gulp-shell');

gulp.task('clean', shell.task([
  'rm -rf build bower_components chrome-app/json-human'
]));

gulp.task('build', shell.task([
  'bower install',
  'cp -R bower_components/json-human chrome-app/'
]));

gulp.task('package', ['build'], function () {
  var app = gulp.src('chrome-app/**/*')
    .pipe(zip('chrome-app.zip'))
    .pipe(gulp.dest('build')),
    extension = gulp.src('chrome-extension/**/*')
    .pipe(zip('chrome-extension.zip'))
    .pipe(gulp.dest('build'));

  return merge(app, extension);
});

gulp.task('default', ['clean', 'build', 'package']);
