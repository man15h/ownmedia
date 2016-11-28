var gulp = require('gulp'),
    clean = require('gulp-clean'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    minify = require('gulp-minify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    uglifyCss = require('gulp-uglifycss'),
    del = require('del'),
    compressor = require('gulp-compressor'),
    runSequence = require('run-sequence'),
    Dgeni = require('dgeni');

gulp.task('clean', function() {
  return del([
    'dist/**/*'
  ]);
});
gulp.task('dgeni', function() {
  try {
    var dgeni = new Dgeni([require('./docs/dgeni-conf')]);
    return dgeni.generate();
  } catch(error) {
    console.log(error.stack);
    throw error;
  }
});
gulp.task('build-root', function() {
  return gulp.src(['index.html','themify-icons.css','main.js'])
    .pipe(gulp.dest('dist'));
});

gulp.task('build-images', function() {
  return gulp.src(['img/**', 'img/icons/**'])
    .pipe(gulp.dest('dist/images'));
});

gulp.task('build-fonts', function () {
  return gulp.src('fonts/**')
    .pipe(gulp.dest('dist/fonts'));
});
gulp.task('build-main-js', function() {
  return gulp.src(['js/angular.js', 'js/main.js','js/facebook.js','js/videos.js','js/youtube.js'])
  // .pipe(minify())
  .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'));
});
gulp.task('build-css', function() {
  return gulp.src('css/*.css')
    // .pipe(uglifyCss())
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest('dist/css'));
});
gulp.task('build-templates', function () {
  return gulp.src('template/*.html')
    .pipe(gulp.dest('dist/template/'));
});
gulp.task('build-bower', function () {
  return gulp.src('bower_components/**')
    .pipe(gulp.dest('dist/bower_components/'));
});
gulp.task('build', function() {
  return runSequence(['build-root','build-main-js', 'build-css','build-templates'], 'jshint');
});
gulp.task('watch-js', function() {
  gulp.watch('js/*.js', ['build']);
});

gulp.task('watch-img', function() {
  gulp.watch('img/**', ['build-images','build']);
});

gulp.task('watch-css', function() {
  gulp.watch('css/*.css', ['build']);
});
gulp.task('watch-html', function() {
  gulp.watch('*.html', ['build']);
});
gulp.task('watch-temp', function() {
  gulp.watch('template/*.html', ['build']);
});

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    port: 9000,
    host: '0.0.0.0'
  });
});

gulp.task('jshint', function() {
  return gulp.src('js/*js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// default task
gulp.task('default', function() {
  return runSequence('clean', 'build', 'build-fonts', 'build-images','build-bower',
    ['watch-js', 'watch-css', 'watch-html', 'watch-img','watch-temp','connect']
  );
});

// task to run in production
gulp.task('build-prod', function() {
  return runSequence('clean', 'build-root', 'build-main-js',  'build-css', 'build-fonts', 'build-images', 'build-lib');
});
