# angularjs_lazyLoading_withGulp

## Create a task which will generate a lazy.js file inside src, which will contain the task generated lazy loading js file paths to ingect in the routing.

## The lazy.js file will look like this, where we will inject the minified and uglified controller specific generated js files

var LAZYLOADING_CONSTANT = [
      {
          name : 'lazy1',
          /*inject:lazy1*/ files: ['']
      },
      {
          name : 'lazy2',
          /*inject:lazy2*/ files: ['']
      },
      {
          name : 'lazyHome',
          /*inject:lazyHome*/ files: ['']
      }
    ]



var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');
var rename = require('gulp-rename');

gulp.task('lazyLoading', function () {
  ## var Lazy1InjectOptions = injectOption('/*inject:lazy1*/ files: [\' ');
  var Lazy2InjectOptions = injectOption('/*inject:lazy2*/ files: [\' ');
##   var Lazy3InjectOptions = injectOption('/*inject:lazyHome*/ files: [\' ');

  ## var lazy1Script = getLazyScript('/**/*.lazy1.lazy.js', 'lazy1.min.js'); // this will uglify all the js files ends with .lazy1.lazy.js and put in lazy1.min.js
  var lazy2Script = getLazyScript('/**/*.lazy2.lazy.js', 'lazy2.min.js'); // this will uglify all the js files ends with .lazy2.lazy.js and put in lazy2.min.js
##   var lazy3Script = getLazyScript('/**/*.lazyHome.lazy.js', 'lazyHome.min.js');



  ## return gulp.src(path.join(conf.paths.src, '/lazy.js'))
    .pipe(gulp.dest(conf.paths.src))
  ##   .pipe(rename('lazyScript.min.js'))
  ##   .pipe(inject(lazy1Script, Lazy1InjectOptions))  // this will replace /*inject:lazy1*/ files: [\' with the lazy1.min.js
    .pipe(inject(lazy2Script, Lazy2InjectOptions))
  ##   .pipe(inject(lazy3Script, Lazy3InjectOptions)) // this will replace /*inject:lazyHome*/ files: [\' with the lazyHome.min.js
    .pipe(gulp.dest(conf.paths.dist));

});

## function injectOption(startTag){
  return {
    starttag: startTag,
    endtag: '\']',
    ignorePath: path.join(conf.paths.tmp, '/partials'),
    addRootSlash: false
  }
};

## function getLazyScript(filePath, concatTo){
  return gulp.src(path.join(conf.paths.src, filePath))
  .pipe($.flatten())
  .pipe(concat(concatTo))
  .pipe($.ngAnnotate())
  .pipe(uglify())
  .pipe(gulp.dest(path.join(conf.paths.dist, '/lazyFolder/')));
};


## If for the other (main) js files, we need to ignore the lazyly loaded js files then -

var injectScripts = gulp.src([
    path.join(conf.paths.src, '/app/**/*.module.js'),
    path.join(conf.paths.src, '/app/**/*.js'),
    path.join('!' + conf.paths.src, '/**/*.lazy.js'),
    path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
    path.join('!' + conf.paths.src, '/app/**/*.mock.js'),
  ])

gulp.src(path.join(conf.paths.src, '/'+index_file+'.html'))
    //.pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
...

Execute the gulp task while build -
gulp.task('build', ['sass', 'lazyLoading']);

# //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

## bower install oclazyload or npm install oclazyload

                ##   Now in the app in the module config, we will generate a list of objects with name and js file list, and fed it to the $ocLazyLoadProvider's config.

                ##   angular
                  .module('LazyLoadModule', ['oc.lazyLoad', ...])
                  .config(ocLazyLoading);

                  function ocLazyLoading($ocLazyLoadProvider){
                  var lazyObject = [];
                  angular.forEach(LAZYLOADING_CONSTANT, function(item){
                    var lazyItem = {name: item.name, files: []};
                    angular.forEach(item.files, function(file){
                      lazyItem.files.push(file.split('dist/')[1].split('"></script>')[0]);
                    });
                    lazyObject.push(lazyItem);
                  });
                ##   $ocLazyLoadProvider.config({
                    'debug': true,
                    'events': true,
                ##     'modules': lazyObject,
                  });
                };


              #  In the route -

                $stateProvider
                .state('home', {
                  url: '/',
                  template: '...',
              ##     resolve: {
              ##         loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
              ##             return $ocLazyLoad.load('lazyHome'); // Resolve promise and load before view
              ##         }]
                  }
                })
                .state('kolkata', {
        url: '/kolkata'
        , resolve: {
            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load('lazy1'); // Resolve promise and load before view
            }]
        }
      })
      .state('delhi', {
        , resolve: {
            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load('lazy2'); // Resolve promise and load before view
            }]
        }
      });



