'use strict';

angular.module('dashApp')
  .controller('DashboardDetailsCtrl', function ( $rootScope, $scope, firebase, $firebaseObject, $routeParams, $timeout ) {

    var lugar = firebase.database().ref('/lugares/' + $rootScope.clienteUid + '/' + $routeParams.id);
    $scope.lugar = $firebaseObject(lugar);

    var actual;
    $scope.editar = function(edi){

      $scope.eNombre = false;
      $scope.eTipo = false;

      if(actual !== edi){
        actual = edi;

        switch(edi)
        {
          case 'eNombre':
            $scope.eNombre = true;
            break;
          case 'eTipo':
            $scope.eTipo = true;
            break;
          default:
            $scope.eNombre = false;
            $scope.eTipo = false;
        }
      }else{
        $scope.eNombre = false;
        $scope.eTipo = false;

        actual = '';
      }
    };

    $(document).ready(function() {
      $('select').material_select();
      $('ul.tabs').tabs();
    });
  });
