'use strict';

angular.module('dashApp')
  .controller('RegistrarseCtrl', function ( $rootScope, $scope, Authentication ) {

    $rootScope.PAGE = 'registrarse';

    $scope.userRegister = function(){
  		Authentication.register($scope.user);
  	};

  });
