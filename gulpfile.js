var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var del = require('del');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var ejs = require('gulp-ejs');
var pump = require('pump');
var express = require('express');
var path = require('path');
var watch = require('gulp-watch');
var fs = require("fs");
var gutil = require('gulp-util');

gulp.task('sass', function() {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('watch', function () {
  gulp.watch('src/**/*.scss', ['sass']);
  gulp.watch('src/**/*.ejs', ['ejs']);
  gulp.watch('src/**/*.js', ['concat', 'js', 'ejs']);
});

gulp.task('concat', function(){
  return gulp.src(['./src/vendor/**/*.js', './src/js/index.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./build/js/'));
})

gulp.task('js', ['concat'], function(cb) {
  pump([
    gulp.src('./src/js/app.js'),
    uglify(),
    gulp.dest('./build/js')
  ],cb);
});

gulp.task('ejs', function() {
  var data = JSON.parse(fs.readFileSync("./src/js/data/data.json"));
  return gulp.src("./src/views/**/*.ejs")
    .pipe(ejs({ 'data' : data })
    .on('error', gutil.log))
  	.pipe(gulp.dest("./build"));
});

// The default task (called when we run `gulp` from cli)
gulp.task('default', ['concat', 'js', 'sass', 'ejs', 'watch'], function() {
  
  var app = express();
  
  // set the view engine to ejs
  app.set('view engine', 'ejs');
  app.set('views', 'build');
  
  // allow static paths to be automatically served
  app.use(express.static(path.join(__dirname, 'build')));
  
  // use res.render to load up an ejs view file
  // index page 
  app.get('/', function(req, res) {
    res.render('pages/index');
  });
  
  app.listen(9000);
  console.log('Listening on localhost:9000');
});