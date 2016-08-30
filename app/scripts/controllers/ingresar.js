'use strict';

angular.module('dashApp')
  .controller('IngresarCtrl', function ( $rootScope, $scope, Authentication ) {

    $rootScope.PAGE = 'ingresar';

    $scope.userLogin = function(){
  		Authentication.login($scope.user);
  	};
  });
