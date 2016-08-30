'use strict';

/**
 * @ngdoc overview
 * @name dashApp
 * @description
 * # dashApp
 *
 * Main module of the application.
 */
angular
  .module('dashApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'ui.materialize',
    'validation.match'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/ingresar.html',
        controller: 'IngresarCtrl',
        controllerAs: 'ingresar'
      })
      .when('/registrarse', {
        templateUrl: 'views/registrarse.html',
        controller: 'RegistrarseCtrl',
        controllerAs: 'registrarse'
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        controllerAs: 'dashboard',
        resolve: {
          currentAuth: function(Authentication){
            return Authentication.requireAuth();
          }
        }
      })
      .when('/dashboard/:id', {
        templateUrl: 'views/dashboardDetails.html',
        controller: 'DashboardDetailsCtrl',
        controllerAs: 'dashboardDetails',
        resolve: {
          currentAuth: function(Authentication){
            return Authentication.requireAuth();
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  });
