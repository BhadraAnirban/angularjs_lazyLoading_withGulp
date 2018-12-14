'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');
var rename = require('gulp-rename');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('lazyLoading', function () {
  var Lazy1InjectOptions = injectOption('/*inject:lazy1*/ files: [\'');
  var Lazy2InjectOptions = injectOption('/*inject:lazy2*/ files: [\'');
  var Lazy3InjectOptions = injectOption('/*inject:lazyHome*/ files: [\'');

  var lazy1Script = getLazyScript('/**/*.lazy1.lazy.js', 'lazy1.min.js');
  var lazy2Script = getLazyScript('/**/*.lazy2.lazy.js', 'lazy2.min.js');
  var lazy3Script = getLazyScript('/**/*.lazyHome.lazy.js', 'lazyHome.min.js');



  return gulp.src(path.join(conf.paths.src, '/lazy.js'))
    .pipe(gulp.dest(conf.paths.src))
    .pipe(rename('lazyScript.min.js'))
    .pipe(inject(lazy1Script, Lazy1InjectOptions))
    .pipe(inject(lazy2Script, Lazy2InjectOptions))
    .pipe(inject(lazy3Script, Lazy3InjectOptions))
    .pipe(gulp.dest(conf.paths.dist));

});

function injectOption(startTag){
  return {
    starttag: startTag,
    endtag: '\']',
    ignorePath: path.join(conf.paths.tmp, '/partials'),
    addRootSlash: false
  }
};

function getLazyScript(filePath, concatTo){
  return gulp.src(path.join(conf.paths.src, filePath))
  .pipe($.flatten())
  .pipe(concat(concatTo))
  .pipe($.ngAnnotate())
  .pipe(uglify())
  .pipe(gulp.dest(path.join(conf.paths.dist, '/lazyFolder/')));
};

///////////////////////////////////////////To ignore the lazy loaded files with extensions end with .lazy.js////////////////////////////////////////////////////////////////////////////////

var injectFiles = function(index_file) {
  var injectStyles = gulp.src([
     path.join(conf.paths.src, '/app/**/*.css'),  path.join(conf.paths.src, '/assets/css/styles/*.css')
   ], { read: false });


  var injectScripts = gulp.src([
    path.join(conf.paths.src, '/app/**/*.module.js'),
    path.join(conf.paths.src, '/app/**/*.js'),
    path.join('!' + conf.paths.src, '/**/*.lazy.js'), // To ignore the lazy loaded files with extensions end with .lazy.js
    path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
    path.join('!' + conf.paths.src, '/app/**/*.mock.js'),
  ])
  .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(path.join(conf.paths.src, '/'+index_file+'.html'))
    //.pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
}
