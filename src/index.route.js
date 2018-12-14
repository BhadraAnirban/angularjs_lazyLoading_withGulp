  angular
    .module('publicAppointment',
      [
        'oc.lazyLoad',
        'ui.bootstrap',
        'ui.router'
      ])
    .config(ocLazyLoading)
    .config(routerConfig);

    function ocLazyLoading($ocLazyLoadProvider){
    var lazyObject = [];
    angular.forEach(LAZYLOADING_CONSTANT, function(item){
      var lazyItem = {name: item.name, files: []};
      angular.forEach(item.files, function(file){
        lazyItem.files.push(file.split('dist/')[1].split('"></script>')[0]);
      });
      lazyObject.push(lazyItem);
    });
    $ocLazyLoadProvider.config({
      'debug': true,
      'events': true,
      'modules': lazyObject,
    });
  };


  function routerConfig($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
      .state('home', {
        url: '/'
        , resolve: {
            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load('lazyHome'); // Resolve promise and load before view
            }]
        }
      })
      .state('kolkata', {
        url: '/kolkata'
        ,
        , resolve: {
            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load('lazy1'); // Resolve promise and load before view
            }]
        }
      })
      .state('delhi', {
        url: '/delhi'
        ,
        , resolve: {
            loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load('lazy2'); // Resolve promise and load before view
            }]
        }
      });
